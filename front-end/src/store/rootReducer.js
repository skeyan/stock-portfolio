import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH";
const SET_STOCK_QUANTITY_MAP = "SET_STOCK_QUANTITY_MAP";
const SET_ERROR = "SET_ERROR";
const GET_STOCK_PRICES = "GET_STOCK_PRICES";

// Initialize the initial state of the store with default values
const initState = {
    // stockQuantityMap is a map containing all the user's purchased stocks
    // in a name (string): total quantity purchased (integer) pair
    stockQuantityMap: new Map(),

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
    * The action setStockQuantityMap(stockMap) adds/updates the map of stocks:quantity
    * to a new, updated map.
*/
export function setStockQuantityMap(stockQuantityMap = {}) {
    return {
        type: SET_STOCK_QUANTITY_MAP,
        stockQuantityMap: stockQuantityMap
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
            if (recalculatedCash >= 0) { // Add to the set of stocks only if the user has enough money to purchase them
                dispatch(setCash(recalculatedCash));

                // Update stockQuantityMap, will be replaced by backend
                // let stockToBeAdded = new Stock(symbol, currentPriceOfSymbol);
                let updatedQuantityMap = getState().stockQuantityMap;
                console.log(getState().stockQuantityMap);
                if (updatedQuantityMap.has(symbol)) {
                    let updatedQuantity = updatedQuantityMap.get(symbol);
                    updatedQuantity += parseInt(quantity);
                    updatedQuantityMap.set(symbol, updatedQuantity);
                }
                else {
                    updatedQuantityMap.set(symbol, parseInt(quantity));
                }

                dispatch(setStockQuantityMap(updatedQuantityMap));
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

        case SET_STOCK_QUANTITY_MAP:
            return Object.assign({}, state, {
                stockQuantityMap: action.stockQuantityMap
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