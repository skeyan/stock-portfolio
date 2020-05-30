import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import '../styles/Portfolio.css';
import '../styles/Fonts.css';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getStockPrices, setFinishedGettingPrices } from '../store/rootReducer';

class Purchase extends Component {
    constructor()
    {
        super();

        this.state = {
            symbol: null,
            quantity: null        
        }
    }

    // This function stores the value of the input field.
    handleChange = (type, e) => {
        // Store the symbol/ticker input
        if (type === "symbol") {
            this.setState({
                symbol: e.target.value
            })
        }
        // Store the quantity input
        else if (type === "quantity") {
            this.setState({
                quantity: e.target.value
            })
        }   
    }

    // This function validates the quantity of stocks purchased.
    // It doesn't check if the user can purchase the stock,
    // only that it's a valid 'quantity' that might be
    // purchaseable. 
    validateQuantity = () => {
        // Double-check the type-checking with code
        // Quantities must be whole-numbers greater than 0
        const enteredQuantity = this.state.quantity;
        // Page load -> neutral color 
        if (enteredQuantity === null) return null; 

        // Non-whole number check
        else if (enteredQuantity % 1 !== 0) return "error";

        // Negative quantity check
        else if (enteredQuantity <= 0) return "error";

        else return "success";
    }

    validateTicker = () => {
        // Simple validation for if ticker length is >= 1
        const tickerSymbol = this.state.symbol;
        // Page load -> neutral color
        if (tickerSymbol === null) return null;

        // Check if the user entered something
        else if (tickerSymbol.length >= 1) return "success";

        else return "error";
    }

    // This function takes the submitted content and sends it off to 
    // the reducer as an action after a preliminary check that the
    // values are at least ready to be submitted for a deeper check.
    // The reducer then checks to see if the stock
    // can indeed be purchased at the quantity entered, and either
    // processes the submitted stock and changes the cash amount,
    // or stores an alert to tell the user went wrong.
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.validateTicker() === "success" && this.validateQuantity() === "success") {
            console.log("Dispatching on success");
            this.props.setFinishedGettingPrices(false);
            this.props.getStockPrices(this.state.symbol, this.state.quantity);
        }  
    }

    render() {
        return (
            <div>
                { !this.props.loggedIn ? (
                    <div>
                        <h4>Please <Link to="/login">log in</Link> to make a purchase.</h4>
                    </div>
                ) : (
                <div>
                    <h3 id="portfolio-header">Cash: <b>${parseFloat(this.props.cash).toFixed(2)}</b></h3> 
                    <form className="purchase-form" onSubmit={this.handleSubmit}>
                        <FormGroup controlId="formBasicText" validationState={this.validateTicker()}>
                            <ControlLabel className="purchase-form-titles">Ticker</ControlLabel>
                            <br></br>
                            <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Enter ticker"
                                onChange={(e) => this.handleChange("symbol", e)}
                                className="purchase-form-field"
                            />
                            <FormControl.Feedback />
                            <p className="help">Enter a stock symbol (ex: SPOT, IBM, AAPL).</p>
                        </FormGroup>
                        <FormGroup controlId="formBasicText" validationState={this.validateQuantity()}>
                            <ControlLabel className="purchase-form-titles">Quantity</ControlLabel>
                            <br></br>
                            <FormControl
                                type="number"
                                min="1" 
                                step="1"
                                value={this.state.value}
                                placeholder="Enter quantity"
                                onChange={(e) => this.handleChange("quantity", e)}
                                className="purchase-form-field"
                            />
                            <FormControl.Feedback />
                            <p className="help">Enter a whole number quantity greater than 0 (ex: 1, 40).</p>
                        </FormGroup>
                        <Button bsStyle="success" type="submit">Buy</Button>
                    </form>
                </div>)
                 }
            </div>
        );
    }
}

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
    return {

    }
  }

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
    return {
        getStockPrices: (symbol, quantity) => dispatch(getStockPrices(symbol, quantity)),
        setFinishedGettingPrices: (finishedGettingPrices) => dispatch(setFinishedGettingPrices(finishedGettingPrices))
    }
  };

// Connect this component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Purchase);