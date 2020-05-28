import React, { Component } from "react";
import { Link } from 'react-router-dom';
import '../styles/Transactions.css';
import { ListGroup, ListGroupItem } from "react-bootstrap";

import "../styles/Transactions.css";

class TransactionsView extends Component {
    render() {
        // Render conditionally depending on
        // 1. if logged in, and have transactions
        // 2. if logged in, with no transactions
        // 3. not logged in
        return (
            <div>
                {this.props.numTransactions > 0 ? (
                    this.props.transactionsArray.map((transaction, i) => (
                        <li key={i}>{transaction.tickerSymbol}</li>
                    ))
                ) : this.props.loggedIn ? (
                    <h3>You have no transactions.</h3>
                ) : (
                    <h3>Please log in to view your transactions.</h3>
                )
            }
            </div>
        );
    }
}

export default TransactionsView;