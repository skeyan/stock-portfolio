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
                    )
                    ) 
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