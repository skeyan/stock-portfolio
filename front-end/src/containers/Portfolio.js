import React, { Component } from 'react';
import '../styles/Portfolio.css';
import Purchase from '../components/Purchase';
import LiveStocksView from '../views/LiveStocksView';
import { Link } from 'react-router-dom';
import AlertDimissable from '../views/AlertView';
import { PageHeader} from "react-bootstrap";
import { connect } from "react-redux";
import { setCash, setError, getStockPrices, getCurrentPrice, setFinishedGettingPrices } from '../store/rootReducer';
import Loader from 'react-loader-spinner';

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
                <PageHeader>
                    Portfolio
                    <p className="data-update">Data updates every 15 minutes.</p>
                </PageHeader>
                <div className="column-big" >
                    {/* LiveStocksView is the view where the stock cards are displayed */}
                    { this.props.finishedGettingPrices ? (
                        <LiveStocksView 
                            loggedIn={this.props.loggedIn} 
                            stocksArray={this.props.stocksArray} 
                            currentPrices={this.props.currentPrices}
                            currentChanges={this.props.currentChanges}
                            getCurrentPrice={this.props.getCurrentPrice}
                            setFinishedGettingPrices={this.props.setFinishedGettingPrices}
                        />
                    ) : !this.props.loggedIn ? (
                        <h4>Please <Link to="/login">log in</Link> to view your stocks.</h4>
                    ) : (
                        <center>      
                            <Loader type="ThreeDots" color="#2fc477" height="100" width="150" />
                        </center>
                    )
                    }
                </div>
                <div className="column-small">
                    { windowVar }
                    {/* Purchase is the component where the user can purchase stocks. */}
                    <Purchase loggedIn={this.props.loggedIn} cash={this.props.cash} />
                </div>
            </div>
        );
    }
}

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
    return {
      cash: state.cash,
      errorMessage: state.error,
      stocksArray: state.stocksArray,
      loggedIn: state.loggedIn,
      currentPrices: state.currentPrices,
      currentChanges: state.currentChanges,
      finishedGettingPrices: state.finishedGettingPrices
    }
  }

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
    return {
      // Set the props function "setCash" dispatch the Store function "setCash" 
      setCash: (cash) => dispatch(setCash(cash)),
      getStockPrices: (symbol, quantity) => dispatch(getStockPrices(symbol, quantity)),
      setError: (error) => dispatch(setError(error)),
      getCurrentPrice: (symbolArr) => dispatch(getCurrentPrice(symbolArr)),
      setFinishedGettingPrices: (finishedGettingPrices) => dispatch(setFinishedGettingPrices(finishedGettingPrices))
    }
  };


// Connect this component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);