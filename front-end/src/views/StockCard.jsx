import React, { Component } from "react";
import {  } from "react-bootstrap";
import '../styles/Portfolio.css';

class StockCard extends Component {
    render() {
        let totalPrice = (parseFloat(this.props.price) * parseFloat(this.props.quantity)).toFixed(2);
        return (
            <div className="stock-card">
                <div className={this.props.colorClass}>
                    <center><h3>{this.props.tickerSymbol}</h3></center>
                    <p>Quantity: {this.props.quantity}</p>
                    <p>Total Price: ${totalPrice}</p>
                    <a href="https://iexcloud.io" className="attribution" target="_blank">IEX Cloud</a>
                </div>
            </div>
        );
    }
}

export default StockCard;