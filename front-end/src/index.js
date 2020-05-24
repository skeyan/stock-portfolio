import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux'; 
import rootReducer from './store/rootReducer';
import logger from 'redux-logger';

/*
  * Create a store and use a Provider so we can use the Redux store throughout the app.
  * Apply the logger middleware so we can see state changes in the console.
*/
const store = createStore(
  rootReducer,
  applyMiddleware(logger)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
