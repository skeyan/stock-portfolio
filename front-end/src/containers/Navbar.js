import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

function Navbar() {
    return (
        <div className="App-Header">
            <div className="App-Title">
                <img src="/bank.png" alt="bank symbol" width="50px"/>
                <br />
                Stockfolio
            </div>
            <ul className="App-Header-Links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li>Transactions</li>
                <li><Link to="/login">Login</Link></li>
                <li>Register</li>
            </ul>
        </div>
    );
}

export default Navbar;