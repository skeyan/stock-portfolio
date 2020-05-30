import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import '../styles/Fonts.css';
import { useHistory } from "react-router-dom";

const Navbar = (props) => {
    // Show login button only if logged out and vice versa
    const history = useHistory();
    let logLink = <li><Link to="/login">Login</Link></li>
    if (props.loggedIn) {
        logLink = <li onClick={logoutUser} id="logoutNav">Logout</li>
    }
    let regLink;
    if (!props.loggedIn) {
        regLink = <li><Link to="register">Register</Link></li>
    }

    // Tell frontend we're logged out
    function logoutUser(){
        // Reset frontend values 
        props.setCurrentUser("");
        props.setNumTransactions(-1);
        props.setCash(5000);
        props.setStocksArray([]);
        props.setChanges(new Map());
        props.setPrices(new Map());
        props.setFinishedGettingPrices(false);
        props.setLoggedIn(false); 
        history.push("/"); // Redirect to homepage wherever the user is
    }

    // Display the navbar
    return (
        <div className="App-Header">
            <div className="App-Title">
                <img src="/bank.svg" alt="bank symbol" width="50px"/>
                <br />
                Stockfolio
            </div>
            <ul className="App-Header-Links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                { logLink }
                { regLink }
            </ul>
        </div>
    );
}

export default Navbar;