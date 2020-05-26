import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH";
const SET_STOCK = "SET_STOCK";
const SET_ERROR = "SET_ERROR";
const GET_STOCK_PRICES = "GET_STOCK_PRICES";

// Initialize the initial state of the store with default values
const initState = {
    // Stocks is a set containing all the user's purchased stocks (should have no repeats)
    stocks: new Set(), 

    // Cash is the float user's current cash, defaulted to $5000 (decreases when buying stocks, cannot go under 0)
    cash: 5000,

    // Error is the string error message containing any error messages from API calls
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
    * The action setStock(stock) adds/updates a the set of stocks in the store
    * to a new, updated set.
*/
export function setStock(stockSet = {}) {
    return {
        type: SET_STOCK,
        stock: stockSet
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
var Stock = function(name, currentPrice) {
    this.name = name;
    this.currentPrice = currentPrice;
};
export const getStockPrices = (symbol, quantity) => {
    return async (dispatch, getState) => {
        // Form the URL with which to make the call
        let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + process.env.ALPHA_VANTAGE_KEY;

        // Make the asynchronous axios call to Alpha Vantage to get the current price of the stock in question
        const response = await axios.get(url);
        // console.log(response);

        // If the response from the call is not an error message, 
        // then log a warning to the user and don't do anything else.
        // This likely means that the symbol entered by the user was invalid.
        if(!response.data["Global Quote"]) {
            // console.log("ERROR: ", response);
            // const currentError = response.data["Error Message"];
            const currentError = "Invalid ticker symbol entered."
            dispatch(setError(currentError));
        }

        // Otherwise, if the response was successful, change the stock price
        // according to quantity and real-time current price of the stock.
        // Also, recalculate the cash the user has on-hand.
        else {
            let currentPriceOfSymbol = parseFloat(response.data["Global Quote"]["05. price"]);
            let recalculatedCash = parseFloat(getState().cash - currentPriceOfSymbol * quantity).toFixed(2);

            // Handle cash calculation
            console.log("CURRENT PRICE OF ", symbol, ": ", currentPriceOfSymbol);
            dispatch(setCash(recalculatedCash));

            // Add to the set of stocks
            let stockToBeAdded = new Stock(symbol, currentPriceOfSymbol);
            let expandedSet = getState().stocks;
            console.log(getState().stocks)
            expandedSet.add(stockToBeAdded);
            dispatch(setStock(expandedSet));
            dispatch(setError("success"));
            // dispatch({
            //     type: GET_STOCK_PRICES,
            //     stocks: response
            // });
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

        case SET_STOCK:
            return Object.assign({}, state, {
                stocks: action.stock
            });

        case SET_ERROR:
            return Object.assign({}, state, {
                error: action.error
            });

        // case GET_STOCK_PRICES:
        //     return Object.assign({}, state, {
        //         stocks: action.stocks
        //     });

        default:
            return state;
    }
}

export default rootReducer;