import React, { Component } from "react";
import { Link } from 'react-router-dom';
import '../styles/Transactions.css';
import { ListGroup, ListGroupItem, PageHeader} from "react-bootstrap";

import "../styles/Transactions.css";

class TransactionsView extends Component {
    render() {
        // Render conditionally depending on
        // 1. if logged in, and have transactions
        // 2. if logged in, with no transactions
        // 3. not logged in
        return (
            <div className="transactions-container">
                <PageHeader>Transactions History</PageHeader>
                <ListGroup>
                { this.props.numTransactions > 0 ? (
                    this.props.transactionsArray.map((transaction, i) => (
                        <ListGroupItem key={i}><b>{transaction.time.toString().substring(0, 10)}</b> - BUY ({transaction.tickerSymbol.toUpperCase()}) - {transaction.quantity} Shares @ ${transaction.totalCost}</ListGroupItem>
                    ))
                ) : this.props.loggedIn ? (
                    <h3>You have no transactions. Visit your <Link to="/portfolio">portfolio</Link> to buy stocks.
                    </h3>
                ) : (
                    <h3>Please <Link to="/login">log in</Link> to view your transaction history.</h3>
                )
                }
                </ListGroup>
            </div>
        );
    }
}

export default TransactionsView;