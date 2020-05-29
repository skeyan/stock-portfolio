import React from "react";
import { Link } from 'react-router-dom';
import '../styles/Transactions.css';
import { ListGroup, ListGroupItem, PageHeader} from "react-bootstrap";
import Loading from '../components/Loading.js';
import "../styles/Transactions.css";

const TransactionsView = props => {
    // Render conditionally depending on
    // 1. if logged in, and have transactions
    // 2. if logged in, with no transactions
    // 3. not logged in

    return (
        <div className="transactions-container">
            <PageHeader>Transactions History</PageHeader>
            <Loading />
            <ListGroup>
            { props.numTransactions > 0 ? (
                props.transactionsArray.map((transaction, i) => (
                    <ListGroupItem key={i}>
                        <b>{transaction.time.toString().substring(0, 10)}</b> - BUY ({transaction.tickerSymbol.toUpperCase()}) - {transaction.quantity} {transaction.quantity > 1 ? "Shares" : "Share"} @ ${transaction.totalCost}
                    </ListGroupItem>
                ))
            ) : props.loggedIn ? (
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

export default TransactionsView;