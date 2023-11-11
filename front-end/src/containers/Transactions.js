import React, { Component } from 'react';
import TransactionsView from '../views/TransactionsView';
import '../styles/Transactions.css';
import '../styles/Fonts.css';
import { connect } from "react-redux";
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';

class Transactions extends Component {
    constructor()
    {
        super();

        this.state = {
            transactionsArray: []
        }
    }

    // Make a GET request to the backend's Transaction route,
    // and retrieve all of the current user's transactions
    getTransactions = () => {
        // Axios call to backend
        const url = `${process.env.REACT_APP_BASE_URL}/transaction/email/` + this.props.currentUser;
        trackPromise(
            axios.get(url)
        .then((res => {
            let myTransactions = res.data.data;

            // Sort transactions so they're displayed with most recent transactions on top/first
            myTransactions.sort((a, b) => {
                let aParsed = Date.parse(a.time);
                let bParsed = Date.parse(b.time);
                if (aParsed > bParsed) {
                    return -1;
                }
                else {
                    return 1;
                }
            })

            if (myTransactions.length > 0) {
                this.setState({
                    transactionsArray: myTransactions
                })
            }
        })).catch((err) => { // failed call
            console.log(err)
            throw err;
        })
        )
    }

    render() {
        // Retrieve transactions
        if (this.props.loggedIn && this.state.transactionsArray.length === 0 && this.props.numTransactions >= 1) { // *
            this.getTransactions();
        }
        return (
            <TransactionsView
                loggedIn={this.props.loggedIn}
                numTransactions={this.props.numTransactions}
                transactionsArray={this.state.transactionsArray}
            />
        );
    }
}

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser,
        loggedIn: state.loggedIn,
        numTransactions: state.currentNumTransactions
    }
}

// Connect this component to the store
export default connect(mapStateToProps)(Transactions);