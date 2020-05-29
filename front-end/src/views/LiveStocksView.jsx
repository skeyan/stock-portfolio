// will have live stock updates of stocks the user has bought
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {  } from "react-bootstrap";
import StockCard from './StockCard';
import axios from 'axios';
import '../styles/Portfolio.css';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../components/Loading.js';

class LiveStocksView extends Component {
    constructor()
    {
        super();

        this.state = {
            stockPrices: new Map(),
            stockChanges: new Map()
        }
    }

    // Make a GET axios call to AlphaVantage to retrieve current stock prices
    getCurrentStockPrices = (symbol) => {
        console.log(process.env.IEX_KEY)
        let url = "https://cloud.iexapis.com/stable/stock/" + symbol + "/quote?token=pk_1980e71d365b44aabc473f0f44812173";

        trackPromise(
        axios.get(url)
        .then((response => {
            console.log(response);
            let currentPriceOfSymbol = parseFloat(response.data.latestPrice);
            let openPrice = parseFloat(response.data.open);
            let currentStatus = "grey";

            if (openPrice - currentPriceOfSymbol < 0) { // less than
                currentStatus = "red"
            }
            else if (openPrice - currentPriceOfSymbol > 0) {
                currentStatus = "green"
            }
            else {
                currentStatus = "grey"
            }

            let updatedMap = this.state.stockPrices;
            updatedMap.set(symbol, currentPriceOfSymbol);

            let updatedChanges = this.state.stockChanges;
            updatedChanges.set(symbol, currentStatus);

            if (currentPriceOfSymbol) {
                this.setState({
                    stockPrices: updatedMap,
                    stockChanges: updatedChanges
                })
            }
        })).catch((err) => { // failed call
            console.log(err)
        })
        )
    }

    render() {
        // Retrieve current stock prices
        // console.log(this.state.stockPrices.size, this.props.stocksArray.length)
        // if (this.props.loggedIn && (this.state.stockPrices.size <= 0 || this.state.stockPrices.size < this.props.stocksArray.length)) { 
        //     for(let i = 0; i < this.props.stocksArray.length; i++)
        //     {
        //         this.getCurrentStockPrices(this.props.stocksArray[i].tickerSymbol);
        //     }
        // }
        return (
            <div>
                <Loading />
                { !this.props.loggedIn ? ( // Am I logged in?
                    <h4>Please <Link to="/login">log in</Link> to monitor your stocks.</h4>
                ) : this.props.stocksArray.length > 0 ? ( // Have I bought stocks?
                    this.props.stocksArray.map((stock, i) => (
                        <div className="stock-card-container">
                            { this.props.currentPrices.get(stock.tickerSymbol) ? (
                                <StockCard 
                                key={stock.tickerSymbol} 
                                colorClass={this.props.currentChanges.get(stock.tickerSymbol)} 
                                tickerSymbol={stock.tickerSymbol.toUpperCase()}
                                quantity={stock.quantity}
                                price={this.props.currentPrices.get(stock.tickerSymbol)}
                            />
                            ) : (
                                <p>Loading stock card...</p>
                            )
                            }
                            
                        </div>
                    ))
                ) : !this.props.stocksArray.length > 0 ? ( 
                    <h4>Purchase a stock to view its stats.</h4>
                ) : (
                    <div></div>
                )
                }
            </div>
        );
    }
}

export default LiveStocksView;