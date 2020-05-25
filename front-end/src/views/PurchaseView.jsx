import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import '../containers/Portfolio.css';


class PurchaseView extends Component {
    constructor()
    {
        super();

        this.state = {
            symbol: "",
            quantity: 0
        }
    }

    // This function stores the value of the input field.
    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({
            symbol: e.target.symbol,
            quantity: e.t
        })
    }

    render() {
        return (
            <div>
                <br />
                Debug: PurchaseView
                <h3 id="portfolio-header">Cash:</h3> 
                <p>${this.props.cash}</p>
                <form>
                    <FormGroup controlId="formBasicText">
                        <ControlLabel className="purchase-form-container">Ticker</ControlLabel>
                        <br></br>
                        <FormControl
                            type="text"
                            value={this.state.value}
                            placeholder="Enter ticker"
                            onChange={this.handleChange}
                            className="purchase-form-field"
                        />
                        <FormControl.Feedback />
                        <p id="help">Enter a valid stock symbol (ex: IBM, AAPL).</p>
                    </FormGroup>
                    <FormGroup controlId="formBasicText">
                        <ControlLabel className="purchase-form-container">Quantity</ControlLabel>
                        <br></br>
                        <FormControl
                            type="text"
                            value={this.state.value}
                            placeholder="Enter quantity"
                            onChange={this.handleChange}
                            className="purchase-form-field"
                        />
                        <FormControl.Feedback />
                        <p id="help">Enter a whole number quantity (ex: 1, 40).</p>
                    </FormGroup>
                    <Button bsStyle="success">Buy</Button>
                </form>
            </div>
        );
    }
}

export default PurchaseView;