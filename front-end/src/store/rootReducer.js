import axios from 'axios';

// Constants will be used to define cases in the rootReducer
const SET_CASH = "SET_CASH" 

// Initialize the initial state of the store with default values
const initState = () => ({
    stocks: [],
    cash: 5000
})

// Actions creators go here
export function setCash(cash = 0) {
    return {
        type: SET_CASH,
        cash: cash
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

        default:
            return state;
    }
}

export default rootReducer;