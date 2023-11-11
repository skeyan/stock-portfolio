import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import Home from './containers/Home.js';
import Navbar from './containers/Navbar.js';
import Footer from './containers/Footer.js';
import Portfolio from './containers/Portfolio.js';
import Login from './containers/Login.js';
import Register from './containers/Register.js';
import Transactions from "./containers/Transactions.js";
import NotFound from './containers/NotFound.js';
import { connect } from "react-redux";
import { setLoggedIn, setCurrentUser, setNumTransactions, setCash, setStocksArray, setPrices, setChanges, setFinishedGettingPrices} from './store/rootReducer';
import './styles/App.css';
import './styles/Fonts.css';

const App = (props) => {
  return (
    /*
      * Uses a Router to switch between pages.
    */
    <div>
      <div className="test">
      <Router>
        <Navbar
                loggedIn={props.loggedIn}
                setStocksArray={props.setStocksArray}
                setLoggedIn={props.setLoggedIn}
                setCurrentUser={props.setCurrentUser}
                setNumTransactions={props.setNumTransactions}
                setCash={props.setCash}
                setPrices={props.setPrices}
                setChanges={props.setChanges}
                setFinishedGettingPrices={props.setFinishedGettingPrices}
        />
          <Switch>
              <Route exact path="/">
                <Home loggedIn={props.loggedIn} />
              </Route>
              <Route exact path="/login">
                { props.loggedIn ? <Redirect to="/" /> : <Login /> }
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/portfolio">
                <Portfolio />
              </Route>
              <Route exact path="/transactions">
                <Transactions />
              </Route>
              {/* Catch all route for an invalid url, happens if none of the above routes are matched: */}
              <Route>
                <NotFound />
              </Route>
          </Switch>
      </Router>
      </div>
      <Footer />
    </div>
  );
}

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
  return {
    loggedIn: state.loggedIn
  }
}

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
  return {
    setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
    setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser)),
    setNumTransactions: (numTransactions) => dispatch(setNumTransactions(numTransactions)),
    setCash: (cash) => dispatch(setCash(cash)),
    setStocksArray: (stocksArray) => dispatch(setStocksArray(stocksArray)),
    setPrices: (currentPrices) => dispatch(setPrices(currentPrices)),
    setChanges: (currentChanges) => dispatch(setChanges(currentChanges)),
    setFinishedGettingPrices: (finishedGettingPrices) => dispatch(setFinishedGettingPrices(finishedGettingPrices))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
