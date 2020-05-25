import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

class Home extends Component {
    constructor()
    {
        super();
    }

    render() {
        return (
            <div className="homepage-message">
                <h2>Welcome to Stockfolio,</h2>
                <p>where you can create an account, buy stocks, and audit your transactions! </p>
                <p>To begin, <Link to="/login">login</Link> or register.</p>
            </div>
        );
    }
}

export default Home;