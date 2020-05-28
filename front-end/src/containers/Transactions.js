import React, { Component } from 'react';
import TransactionsView from '../views/TransactionsView';
import '../styles/Transactions.css';
import { connect } from "react-redux";
import axios from 'axios';

class Transactions extends Component {
    constructor()
    {
        super();

        this.state = {
            transactionsArray: []
        }
    }

    // Make a GET request to the backend's Transaction route
    // and retrieve all of the current user's transactions
    getTransactions = () => {
        // Axios call to backend
        axios.get("http://localhost:5000/transaction/email/" + this.props.currentUser)
        .then((res => {
            let myTransactions = res.data.data;
            if (myTransactions.length > 0) {
                this.setState({
                    transactionsArray: myTransactions
                })
            }
        })).catch((err) => { // failed call
            console.log(err)
        })
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