import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Login from './components/Login.js';
import './App.css';

class App extends Component {

  constructor() {
    super();

    this.state = {
        // Default state values
    }
  }

  // Functions go here

  render () {

    // const HomeComponent = () => (<Home />);

    return (
      /*
        * Uses a Router to switch between pages.
        * Currently, it only routes to a homepage.
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
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;
