import React, { Component } from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div className="homepage-message">
                { this.props.loggedIn === false ? (
                    <div>
                        <h2>Welcome to Stockfolio,</h2>
                        <p>where you can create an account, buy stocks, and audit your transactions! </p>
                        <p>To begin, <Link to="/login">login</Link> or <Link to="/register">register.</Link></p>
                    </div>
                ) : (
                    <div>
                        <h2>Hi there!</h2>
                        <p>To purchase and monitor stocks, visit your <Link to="/portfolio">portfolio</Link>.</p>
                        <p>To perform an audit, visit your <Link to="/transactions">transactions page</Link>.</p>
                    </div>
                )
                }

            </div>
        );
    }
}

export default Home;