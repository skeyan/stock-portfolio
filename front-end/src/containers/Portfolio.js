import React, { Component } from 'react';
import '../styles/Portfolio.css';
import PurchaseView from '../views/PurchaseView';
import AlertDimissable from '../views/AlertView';
import { connect } from "react-redux";
import { setCash, setError, getStockPrices } from '../store/rootReducer';

class Portfolio extends Component {
    constructor()
    {
        super();

        // Default state values go below
        this.state = {
            // Default values for the app
            cash: 5000
        }
    }

    // Debug only - causes refresh everytime the page loads (the call is made and reset each time)
    componentDidMount() {
        // Set the initial cash value to $5000 (debugging purposes)
        // this.props.setCash(5000);
        // this.props.setStock(new Set());
        // this.props.getStockPrices("IBM", 1);
    }

    render() {
        let windowVar;
        if (this.props.errorMessage !== null && this.props.errorMessage !== "")
        {
            // windowVar = window.alert(this.props.errorMessage); // debug
            // Alert the user of the status of their transaction/purchase.
            if (this.props.errorMessage === "success") { // Successful purchase
                windowVar = <AlertDimissable 
                                    setRegistrationAlert="n/a"
                                    alertClass="alert-container"
                                    setLoginAlert="n/a"
                                    validity="true" 
                                    message="Successful purchase!" 
                                    message2="Go to Transactions to audit your stocks."/>
            }
            else { // Unsuccessul purchase
                windowVar = <AlertDimissable 
                                    alertClass="alert-container"
                                    setRegistrationAlert="n/a"
                                    setLoginAlert="n/a"
                                    validity="false" 
                                    message="Oh snap! The purchase didn't go through."
                                    errorMessage={this.props.errorMessage}/>
                                    
                                    
            }
        }

        return ( 
            <div className="portfolio-container">
                <h3 id="portfolio-header">Portfolio ($AMOUNT_WITH_STOCKS)</h3>
                <div className="column">
                    { windowVar }
                    {/* PurchaseView is the component where the user can purchase stocks. */}
                    <PurchaseView cash={this.props.cash} />
                </div>
                <div className="column">
                    <h2>Live Stocks Go Here</h2>
                </div>
            </div>
        );
    }
}

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
    return {
      // Set the props variable "cash" to be the value of the "cash" variable in the Store
      cash: state.cash,
      errorMessage: state.error
    }
  }

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
    return {
      // Set the props function "setCash" dispatch the Store function "setCash" 
      setCash: (cash) => dispatch(setCash(cash)),
      getStockPrices: (symbol, quantity) => dispatch(getStockPrices(symbol, quantity)),
      setError: (error) => dispatch(setError(error))
    }
  };


// Connect this component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);