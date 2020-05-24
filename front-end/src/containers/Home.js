import React, { Component } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

class Home extends Component {
    constructor()
    {
        super();

        // Default state values go below
        // this.state = {
        //     // Default values, currently hardcoded
        //     money: 5000
        // }
    }

    render() {
        return (
            <div className="homepage-message">
                <h2>Welcome to Stock Portfolio,</h2>
                <p>where you can create an account, buy stocks, and view your transactions! </p>
                <p>To begin, <Link to="/login">login</Link> or signup.</p>
            </div>
        );
    }
}

export default Home;