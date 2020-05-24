import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.js';
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
      <Router>
        <Switch>
            {/* <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header> */}
            <Route className="App" exact path="/">
              <Home />
            </Route>
        </Switch>
        
      </Router>
    );
  }
}

export default App;
