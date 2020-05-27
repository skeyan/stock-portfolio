import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH";
const SET_STOCKS_ARRAY = "SET_STOCKS_ARRAY";
const SET_ERROR = "SET_ERROR";

// Initialize the initial state of the store with default values
const initState = {
    // an array containing all the user's purchased stocks' ticker/symbol
    stocksArray: [],

    // cash is the float user's current cash, defaulted to $5000 (decreases when buying stocks, cannot go under 0)
    cash: 5000,

    // error is the string error message containing any error messages from API calls
    error: ""
}

// Actions ----------------------------------------------------------------------------
/*
    * The action setCash(cash) sets the cash amount in the store
    * to equal whatever number value is passed in.
*/
export function setCash(cash = 0) {
    return {
        type: SET_CASH,
        cash: cash
    }
}

/*
    * The action adds to the 
*/
export function setStocksArray(stocksArray = {}) {
    return {
        type: SET_STOCKS_ARRAY,
        stocksArray: stocksArray
    }
}

/*
    * The action setError(error) sets the current error message
    * that will be shown to the user to whatever string is passed in.
*/
export function setError(error = "") {
    return {
        type: SET_ERROR,
        error: error
    }
}

// Thunks -----------------------------------------------------------------------------
/*
    * The thunk getStockPrices(symbol, quantity) makes an axios call to Alpha Vantage
    * to get the global quote for the symbol passed in.
    * Its purpose is to retrieve prices and make the transaction, if possible,
    * or otherwise create a relevant alert.
*/
var Stock = function(name, currentPrice) { // Stock object, testing structure
    this.name = name;
    this.currentPrice = currentPrice;
};
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
                dispatch(setCash(recalculatedCash)); // front-end variable only right now

                let myStocks = getState().stocksArray;
                if (myStocks.includes(symbol)) { // user already has the stock
                    // update quantity of that stock in backend TBA HERE
                }
                else { // user doesn't have the stock yet
                    myStocks.push(symbol);
                    // also update backend with that stock TBA HERE
                }
                
                dispatch(setStocksArray(myStocks));
                dispatch(setError("success")); // Alert the user of the success
            }
            else { // Otherwise, there's not enough cash so don't let the purchase go through and alert the user
                dispatch(setError("Not enough cash for purchase."));
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

        case SET_ERROR:
            return Object.assign({}, state, {
                error: action.error
            });

        default:
            return state;
    }
}

export default rootReducer;