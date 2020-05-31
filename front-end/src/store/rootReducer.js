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
    currentPrices: new Map(), // stockName:currentPrice map 
    currentChanges: new Map(), // stockName:change map. Grey if neutral, red if less than open price, green if higher
    finishedGettingPrices: false // True if the API call to get prices has finished and false otherwise
}

// Actions ----------------------------------------------------------------------------

// The action sets the cash amount in the frontend
export function setCash(cash = 0) {
    return {
        type: SET_CASH,
        cash: cash
    }
}

// The action updates the stocks array in the frontend 
// The stocks array contains the name of all stocks the user has
export function setStocksArray(stocksArray = {}) {
    return {
        type: SET_STOCKS_ARRAY,
        stocksArray: stocksArray
    }
}

// The action sets the logged in status true or false in the frontend
export function setLoggedIn(loggedIn) {
    return {
        type: SET_LOGGED_IN,
        loggedIn: loggedIn
    }
}

// The action sets the current user in the frontend
export function setCurrentUser(currentUser) {
    return {
        type: SET_CURRENT_USER,
        currentUser: currentUser
    }
}

// The action sets the current error message
// The error message will be shown to the user to whatever string is passed in.
export function setError(error = "") {
    return {
        type: SET_ERROR,
        error: error
    }
}

// The action sets the number of transactions of current user in the frontend
export function setNumTransactions(numTransactions) {
    return {
        type: SET_NUM_TRANSACTIONS,
        numTransactions: numTransactions
    }
}

// The action updates the current stock prices in the frontend
export function setPrices(currentPrices) {
    return {
        type: SET_PRICES,
        currentPrices: currentPrices
    }
}

// The action updates the current stock change statuses in the front end
// This is used to show if stocks are green, red or grey
export function setChanges(currentChanges) {
    return {
        type: SET_CHANGES,
        currentChanges: currentChanges
    }
}

// The action tells the front end that we've finished making the call to the API
// so it is now safe to load the stock cards.
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
        const response = await axios.get("https://stockfolio-app-back.herokuapp.com/user/email/" + getState().currentUser + "/number");
        if (response.data.success) {
            dispatch(setNumTransactions(response.data.data))
        }
    }
}

// The thunk gets the amount of cash the user has with a backend axios call
export const getCash = () => {
    return async (dispatch, getState) => {
        const response = await axios.get("https://stockfolio-app-back.herokuapp.com/user/email/" + getState().currentUser + "/cash");
        if (response.data.success) {
            dispatch(setCash(response.data.data))
        }
    }
}

// The thunk gets the user's stocks with a backend axios call
export const getStocks = () => {
    return async (dispatch, getState) => {
        const response = await axios.get("https://stockfolio-app-back.herokuapp.com/stock/email/" + getState().currentUser + "/all");
        if (response.data.success) {
            if (response.data.data.length <= 0) {
                dispatch(setFinishedGettingPrices(true));
            }
            else {
                dispatch(setStocksArray(response.data.data));
                dispatch(getCurrentPrice(response.data.data));
            }
        }
    }
}

// The thunk gets the current (and open) prices of the stocks passed in with an API call
// Purpose: To update the stocks in the Portfolio page when needed
export const getCurrentPrice = (symbolArr) => {
    return async (dispatch, getState) => {
        for(let i = 0; i < symbolArr.length; i++) {
            let currentSymbol = symbolArr[i].tickerSymbol;
            let urlQuote = "https://cloud.iexapis.com/stable/stock/" + currentSymbol + "/quote?token=pk_1980e71d365b44aabc473f0f44812173";

            // Make an API call in order to get the cur
            const response = await axios.get(urlQuote); 
            if (response) {
                let currentPriceOfSymbol = parseFloat(response.data.latestPrice).toFixed(2);

                let openPrice = parseFloat(parseFloat(response.data.previousClose).toFixed(2)).toFixed(2);
                // Only use the open price if the API value for it is not null
                if (response.data.open) { openPrice = parseFloat(parseFloat(response.data.open).toFixed(2)).toFixed(2); } 

                let currentStatus = "grey";
                if (currentPriceOfSymbol - openPrice < 0) { // less than open -> red
                    currentStatus = "red"
                }
                else if (currentPriceOfSymbol - openPrice > 0) { // greater than open -> green
                    currentStatus = "green"
                }
                else { // same as open/neutral -> green
                    currentStatus = "grey"
                }

                if (!response.data.isUSMarketOpen) { 
                    if (response.data.open) {
                        currentPriceOfSymbol = parseFloat(response.data.open).toFixed(2);
                    }
                    else {
                        currentPriceOfSymbol = parseFloat(response.data.previousClose); 
                    }
                }

                let updatedMap = getState().currentPrices;
                updatedMap.set(currentSymbol, currentPriceOfSymbol);

                let updatedChanges = getState().currentChanges;
                updatedChanges.set(currentSymbol, currentStatus);

                dispatch(setPrices(updatedMap)); // Update stock prices in front end
                dispatch(setChanges(updatedChanges)); // Update comparative change of stocks (red, green, neutral) in front end
            }
        }
        // Tell the front end we're finished retrieving prices, in order to load the stock cards
        dispatch(setFinishedGettingPrices(true));
    }
}

// The thunk makes an axios call to an API to get the global quote for the symbol passed in.
// Purpose: To retrieve the latest price and make the transaction, if possible, or otherwise create a relevant alert.
export const getStockPrices = (symbol, quantity) => {
    return async (dispatch, getState) => {
        // Form the URL with which to make the call
        let url = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_1980e71d365b44aabc473f0f44812173";

        // Make the asynchronous axios call to get the current price of the stock in question
        let response;

        await axios.get(url).then((r) => {
            response = r;
        }).catch((err) => { // 404 error handling -> set error
            if (err) {
                console.log("here1")
                const currentError = "Invalid ticker symbol entered."
                dispatch(setError(currentError));
                dispatch(setFinishedGettingPrices(true));
            } 
        })
        
        // If the response from the call is not an error message, 
        // then log a warning to the user and don't do anything else.
        // This means that the symbol entered by the user was invalid, or the limit of messages was reached for the API key.
        if (response) { // Our call worked -> deal with the stock data
            if(!response.data) { // If no data was returned, the symbol doesn't work -> set error
                const currentError = "Invalid ticker symbol entered."
                dispatch(setError(currentError));
                dispatch(setFinishedGettingPrices(true));
            }

            // Otherwise, if the response was successful, change the stock price According to quantity and the current price of the stock.
            // Also, recalculate the cash the user has on-hand and add the stock to the user's stocks.
            else { // Data was returned! Store it properly.
                // If the market is closed, use the last closing price or the last open price (if available) as the price point.
                // Open price cannot always be used because it may be 'null' depending on IEX.
                // Otherwise, use the current latest price as the price point.
                let currentPriceOfSymbol = parseFloat(response.data.latestPrice).toFixed(2);
                
                if (!response.data.isUSMarketOpen) { 
                    if (response.data.open) {
                        currentPriceOfSymbol = parseFloat(response.data.open).toFixed(2);
                    }
                    else {
                        currentPriceOfSymbol = parseFloat(response.data.previousClose); 
                    }
                }
                // console.log("CURRENT PRICE OF SYMBOL:" , currentPriceOfSymbol)
            
                // Calculate the theoretical future cash if the transaction went through
                let recalculatedCash = parseFloat(getState().cash - currentPriceOfSymbol * quantity).toFixed(2);
                
                // Handle cash calculation
                if (recalculatedCash >= 0) { // Add to the set of stocks only if the user has enough money to purchase them
                    dispatch(setError("success"));

                    // Updating Cash: ------------------------------
                    dispatch(setCash(recalculatedCash)); // Update the user's cash balance in the front-end
                    const cashUpdate = {
                        email: getState().currentUser,
                        cashBalance: recalculatedCash
                    }
                    // Update the user's cash balance in the backend
                    await axios.post("https://stockfolio-app-back.herokuapp.com/user/balance/update", cashUpdate);

                    // Updating Stocks: ------------------------------
                    let upperSymbol = symbol.toUpperCase();
                    const stockUpdate = {
                        email: getState().currentUser,
                        tickerSymbol: upperSymbol,
                        quantity: parseFloat(quantity)
                    }
                    let myStocks = getState().stocksArray;
                    let alreadyInArray = false;
                    let index = -1;
                    for(let i = 0; i < myStocks.length; i++) {
                        if (myStocks[i].tickerSymbol.toUpperCase() === upperSymbol) {
                            alreadyInArray = true; // If the stock is in array, set to true
                            index = i;
                            break;
                        }
                    }
                    if (alreadyInArray === false) { // User doesn't have stock yet -> add to array
                        myStocks.push(stockUpdate);
                    } else { // User has stock already -> update corresponding value in array
                        myStocks[index].quantity += parseFloat(quantity);
                    }
                    dispatch(setStocksArray(myStocks)); // Update the user's current stocks in the frontend 
                    dispatch(getCurrentPrice(myStocks)); // Update the user's current stocks' prices in the frontend

                    // Update the relevant stock in the backend.
                    await axios.post("https://stockfolio-app-back.herokuapp.com/stock/update", stockUpdate);

                    // Updating Transactions: ------------------------------
                    // Retrieve the user's amount of transactions by 1
                    const response = await axios.get("https://stockfolio-app-back.herokuapp.com/user/email/" + getState().currentUser + "/number");
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
                    // Update the number of transactions in the frontend.
                    dispatch(setNumTransactions(newNumTransactions));

                    const transactionUpdate = {
                        email: getState().currentUser,
                        tickerSymbol: upperSymbol,
                        quantity: quantity,
                        totalCost: currentPriceOfSymbol * quantity
                    }
                    // Add a new transaction in the backend.
                    await axios.post("https://stockfolio-app-back.herokuapp.com/transaction/new", transactionUpdate);
                    
                    const numTransactionsUpdate = {
                        email: getState().currentUser,
                        totalTransactions: newNumTransactions
                    }
                    // Update the user's number of transactions in the backend.
                    await axios.post("https://stockfolio-app-back.herokuapp.com/user/transactions/update", numTransactionsUpdate);
                }
                else { 
                    // Otherwise, there's not enough cash so don't let the purchase go through and alert the user
                    dispatch(setError("Not enough cash for purchase.")); 
                    dispatch(setFinishedGettingPrices(true));
                }
            }
        }
        else {
            dispatch(setError("Invalid ticker symbol.")); // Bad endpoint catch-all
            dispatch(setFinishedGettingPrices(true));
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