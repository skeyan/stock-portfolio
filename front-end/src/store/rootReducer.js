import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH";
const GET_STOCK_PRICES = "GET_STOCK_PRICES";

// Initialize the initial state of the store with default values
const initState = () => ({
    stocks: {},
    cash: 5000
})

// Thunks go below
/*
    * The function setCash(cash) sets the cash amount in the store
    * to equal whatever number value is passed in.
*/
export function setCash(cash = 0) {
    return {
        type: SET_CASH,
        cash: cash
    }
}

/*
    * The function getStockPrices(symbol, quantity) makes an axios call to Alpha Vantage
    * to get the global quote for the symbol passed in.
    * If successful, the axios call will return an object 
    * (more functionality later)
*/
export const getStockPrices = (symbol, quantity) => {
    return async (dispatch, getState) => {
        // Form the URL with which to make the call
        let url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + process.env.ALPHA_VANTAGE_KEY;

        // Make the asynchronous axios call to Alpha Vantage to get the current price of the stock in question
        const response = await axios.get(url);
        // console.log(response);

        // If the response from the call is not an error message, then log a warning to the user and don't do anything else
        // This likely means that the symbol entered by the user was invalid.

        // Otherwise, if the response was successful, change the stock price
        let currentPriceOfSymbol = response.data["Global Quote"]["05. price"];
        let recalculatedCash = getState().cash - currentPriceOfSymbol * quantity;
        console.log(currentPriceOfSymbol);
        dispatch(setCash(recalculatedCash));
        dispatch({
            type: GET_STOCK_PRICES,
            stocks: response
        });
    }
}

/*
    * The rootReducer is responsible for taking actions sent to it
    * and changing the state accordingly (the store uses the rootReducer).
    * Because this app is small, there will only be one reducer.
*/
function rootReducer(state = initState, action = {}) {
    switch (action.type) 
    {
        // More action cases go here
        case SET_CASH:
            return Object.assign({}, state, {
                cash: action.cash
            });

        case GET_STOCK_PRICES:
            return Object.assign({}, state, {
                stocks: action.stocks
            });

        default:
            return state;
    }
}

export default rootReducer;