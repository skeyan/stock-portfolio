import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Navbar() {
    return (
        <div className="App-Header">
            <div className="App-Title">
                <img src="/bank.png" alt="bank symbol" width="50px"/>
                <br />
                Stock Portfolio
            </div>
            <div className="App-Header-Links"><Link to="/">Home</Link> | Portfolio | Transactions | <Link to="/login">Login</Link> | Register</div>
        </div>
    );
}

export default Navbar;