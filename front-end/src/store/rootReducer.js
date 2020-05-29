import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH";
const SET_STOCKS_ARRAY = "SET_STOCKS_ARRAY";
const SET_ERROR = "SET_ERROR";
const SET_LOGGED_IN = "SET_LOGGED_IN";
const SET_CURRENT_USER = "SET_CURRENT_USER";
const SET_NUM_TRANSACTIONS = "SET_NUM_TRANSACTIONS";
const SET_PRICES = "SET_PRICES";
const SET_CHANGES = "SET_CHANGES";
const SET_FINISHED_GETTING_PRICES = "SET_FINISHED_GETTING_PRICES";

// Initialize the initial state of the store with default values
const initState = {
    stocksArray: [], // an array containing all the user's purchased stocks' ticker/symbol
    cash: 5000, // user's current cash they can use to buy stuff with
    error: "", // error message containing any error messages from API calls
    loggedIn: false, // frontend logged-in status
    currentUser: "", // email of current user, empty if not logged in
    currentNumTransactions: -1, // num transactions of current user, -1 if not logged in
    currentPrices: new Map(),
    currentChanges: new Map(),
    finishedGettingPrices: false
}

// Actions ----------------------------------------------------------------------------

// The action sets the cash amount in the store
// to equal whatever number value is passed in.
export function setCash(cash = 0) {
    return {
        type: SET_CASH,
        cash: cash
    }
}

// The action updates the stocks array
export function setStocksArray(stocksArray = {}) {
    return {
        type: SET_STOCKS_ARRAY,
        stocksArray: stocksArray
    }
}

// The action sets the logged in status true or false
export function setLoggedIn(loggedIn) {
    return {
        type: SET_LOGGED_IN,
        loggedIn: loggedIn
    }
}

// The action sets the current user 
export function setCurrentUser(currentUser) {
    return {
        type: SET_CURRENT_USER,
        currentUser: currentUser
    }
}

// The action sets the current error message
// that will be shown to the user to whatever string is passed in.
export function setError(error = "") {
    return {
        type: SET_ERROR,
        error: error
    }
}


// The action sets the number of transactions of current user
export function setNumTransactions(numTransactions) {
    return {
        type: SET_NUM_TRANSACTIONS,
        numTransactions: numTransactions
    }
}

// The action updates the current stock prices
export function setPrices(currentPrices) {
    return {
        type: SET_PRICES,
        currentPrices: currentPrices
    }
}

// The action updates the current stock change statuses
export function setChanges(currentChanges) {
    return {
        type: SET_CHANGES,
        currentChanges: currentChanges
    }
}

export function setFinishedGettingPrices(finishedGettingPrices) {
    return {
        type: SET_FINISHED_GETTING_PRICES,
        finishedGettingPrices: finishedGettingPrices
    }
}

// Thunks -----------------------------------------------------------------------------

// The thunk gets the number of transactions of current user with a backend axios call
export const getNumTransactions = () => {
    return async (dispatch, getState) => {
        const response = await axios.get("http://localhost:5000/user/email/" + getState().currentUser + "/number");
        if (response.data.success) {
            dispatch(setNumTransactions(response.data.data))
        }
    }
}

// The thunk gets the amount of cash the user has with a backend axios call
export const getCash = () => {
    return async (dispatch, getState) => {
        const response = await axios.get("http://localhost:5000/user/email/" + getState().currentUser + "/cash");
        if (response.data.success) {
            dispatch(setCash(response.data.data))
        }
    }
}

// The thunk gets the user's stocks with a backend axios call
export const getStocks = () => {
    return async (dispatch, getState) => {
        const response = await axios.get("http://localhost:5000/stock/email/" + getState().currentUser + "/all");
        console.log(response.data.data)
        if (response.data.success) {
            console.log(response.data.data)
            dispatch(setStocksArray(response.data.data));
            dispatch(getCurrentPrice(response.data.data))
        }
    }
}

// The thunk gets the current prices of the stocks passed in with an API call
export const getCurrentPrice = (symbolArr) => {
    return async (dispatch, getState) => {
        for(let i = 0; i < symbolArr.length; i++) {
            let currentSymbol = symbolArr[i].tickerSymbol;
            let url = "https://cloud.iexapis.com/stable/stock/" + currentSymbol + "/quote?token=pk_1980e71d365b44aabc473f0f44812173";
            const response = await axios.get(url);
            if (response) {
                let currentPriceOfSymbol = parseFloat(parseFloat(response.data.latestPrice).toFixed(2)).toFixed(2);
                let openPrice = parseFloat(parseFloat(response.data.open).toFixed(2)).toFixed(2);
                let currentStatus = "grey";

                console.log(currentPriceOfSymbol, openPrice)

                if (openPrice - currentPriceOfSymbol < 0) { // less than
                    currentStatus = "red"
                }
                else if (openPrice - currentPriceOfSymbol > 0) {
                    currentStatus = "green"
                }
                else {
                    currentStatus = "grey"
                }

                let updatedMap = getState().currentPrices;
                updatedMap.set(currentSymbol, currentPriceOfSymbol);

                console.log("NEW MAP: ", updatedMap);

                let updatedChanges = getState().currentChanges;
                updatedChanges.set(currentSymbol, currentStatus);

                dispatch(setPrices(updatedMap));
                dispatch(setChanges(updatedChanges));
            }
        }
        console.log("here")
        dispatch(setFinishedGettingPrices(true))
    }
}

/*
    * The thunk makes an axios call to Alpha Vantage
    * to get the global quote for the symbol passed in.
    * Its purpose is to retrieve prices and make the transaction, if possible,
    * or otherwise create a relevant alert.
*/
export const getStockPrices = (symbol, quantity) => {
    return async (dispatch, getState) => {
        // Form the URL with which to make the call
        let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + process.env.ALPHA_VANTAGE_KEY;

        // Make the asynchronous axios call to get the current price of the stock in question
        const response = await axios.get(url);
        
        // If the response from the call is not an error message, 
        // then log a warning to the user and don't do anything else.
        // This likely means that the symbol entered by the user was invalid.
        if(!response.data["Global Quote"]) {
            const currentError = "Invalid ticker symbol entered."
            dispatch(setError(currentError));
        }

        // Otherwise, if the response was successful, change the stock price
        // according to quantity and real-time current price of the stock.
        // Also, recalculate the cash the user has on-hand and add the stock to the user's stocks.
        else {
            let currentPriceOfSymbol = parseFloat(response.data["Global Quote"]["05. price"]);
            let recalculatedCash = parseFloat(getState().cash - currentPriceOfSymbol * quantity).toFixed(2);

            // Handle cash calculation
            if (recalculatedCash >= 0) { // Add to the set of stocks only if the user has enough money to purchase them
                // CASH UPDATING
                dispatch(setCash(recalculatedCash)); // Update the user's cash balance in the front-end
                // also update cash in backend 
                const cashUpdate = {
                    email: getState().currentUser,
                    cashBalance: recalculatedCash
                }
                await axios.post("http://localhost:5000/user/balance/update", cashUpdate).then(
                    dispatch(setError("success"))
                ).catch((err) => {
                    dispatch(setError("Failed to update cash balance."))
                 }
                );

                // STOCK UPDATING
                const stockUpdate = {
                    email: getState().currentUser,
                    tickerSymbol: symbol,
                    quantity: quantity
                }
                // update frontend stocks
                let myStocks = getState().stocksArray;
                // console.log(symbol, myStocks)
                let alreadyInArray = false;
                let index = -1;
                for(let i = 0; i < myStocks.length; i++) {
                    if (myStocks[i].tickerSymbol === symbol) {
                        alreadyInArray = true; // If the stock is in array, set to true
                        index = i;
                        break;
                    }
                }
                

                if (alreadyInArray === false) { // user doesn't have stock yet
                    myStocks.push(stockUpdate);
                } else { // user has stock already
                    myStocks[index].quantity += parseFloat(quantity);
                }
                dispatch(setStocksArray(myStocks))
                dispatch(getCurrentPrice(myStocks))

                // also update backend with the stock
                await axios.post("http://localhost:5000/stock/update", stockUpdate).then(
                    dispatch(setError("success"))
                ).catch((err) => {
                    dispatch(setError("Failed to update user's stocks."))
                    }
                );

                // update frontend transactions
                const response = await axios.get("http://localhost:5000/user/email/" + getState().currentUser + "/number");
                let newNumTransactions = 1;
                if(response.data.success) {
                    console.log(response);
                    newNumTransactions = response.data.data + 1;
                }
                else if(getState.currentNumTransactions) {
                    newNumTransactions = getState().currentNumTransactions + 1;
                } 
                else {
                    newNumTransactions = 1;
                }
                dispatch(setNumTransactions(newNumTransactions));
                // update backend transactions
                const transactionUpdate = {
                    email: getState().currentUser,
                    tickerSymbol: symbol,
                    quantity: quantity,
                    totalCost: currentPriceOfSymbol * quantity
                }
                await axios.post("http://localhost:5000/transaction/new", transactionUpdate).then(
                    dispatch(setError("success"))
                ).catch((err) => {
                    dispatch(setError("Failed to update user's transactions."))
                }
                );
                const numTransactionsUpdate = {
                    email: getState().currentUser,
                    totalTransactions: newNumTransactions
                }
                await axios.post("http://localhost:5000/user/transactions/update", numTransactionsUpdate).then(
                    dispatch(setError("success"))
                ).catch((err) => {
                    dispatch(setError("Failed to update user's total number of transactions."))
                })
            }
            else { 
                // Otherwise, there's not enough cash so don't let the purchase go through and alert the user
                dispatch(setError("Not enough cash for purchase.")); // Alert the user of the failure
            }
        }
    }
}

// Reducer ---------------------------------------------------------------------------
/*
    * The rootReducer is responsible for taking actions sent to it
    * and changing the state accordingly (the store uses the rootReducer).
    * Because this app is small, there will only be one reducer.
*/
function rootReducer(state = initState, action = {}) {
    switch (action.type) 
    {
        // Action cases go here
        // Change the Store's state according to the action received
        case SET_CASH:
            return Object.assign({}, state, {
                cash: action.cash
            });

        case SET_STOCKS_ARRAY:
            return Object.assign({}, state, {
                stocksArray: action.stocksArray
            });

        case SET_LOGGED_IN:
            return Object.assign({}, state, {
                loggedIn: action.loggedIn
            })

        case SET_CURRENT_USER: 
            return Object.assign({}, state, {
                currentUser: action.currentUser
            })

        case SET_NUM_TRANSACTIONS:
            return Object.assign({}, state, {
                currentNumTransactions: action.numTransactions
            })

        case SET_PRICES:
            return Object.assign({}, state, {
                currentPrices: action.currentPrices
            })

        case SET_FINISHED_GETTING_PRICES:
            return Object.assign({}, state, {
                finishedGettingPrices: action.finishedGettingPrices
            })

        case SET_CHANGES:
            return Object.assign({}, state, {
                currentChanges: action.currentChanges
            })

        case SET_ERROR:
            return Object.assign({}, state, {
                error: action.error
            });

        default:
            return state;
    }
}

export default rootReducer;