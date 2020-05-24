// Actions go below
// Setup the initial state of the store
const initState = () => ({
    stocks: []
})

/*
    * The rootReducer is responsible for taking actions sent to it
    * and changing the state accordingly (the store uses the rootReducer).
    * Because this app is small, there will only be one reducer.
*/
function rootReducer(state = initState, action = {}) {
    return state;
}

export default rootReducer;