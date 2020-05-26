import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home.js';
import Navbar from './containers/Navbar.js';
import Footer from './containers/Footer.js';
import Portfolio from './containers/Portfolio.js';
import Login from './containers/Login.js';
import Register from './containers/Register.js';
import NotFound from './containers/NotFound.js';
import './styles/App.css';

class App extends Component {

  constructor() {
    super();
  }

  // Functions go here

  render () {
    return (
      /*
        * Uses a Router to switch between pages.
      */
     <div>
        <Router>
        <Navbar />
          <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/portfolio">
                <Portfolio />
              </Route>
              {/* Catch all route for an invalid url: */}
              <Route>
                <NotFound />
              </Route>
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
