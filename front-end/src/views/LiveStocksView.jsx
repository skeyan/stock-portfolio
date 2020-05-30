// will have live stock updates of stocks the user has bought
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {  } from "react-bootstrap";
import StockCard from './StockCard';
import '../styles/Portfolio.css';
import Loading from '../components/Loading.js';

class LiveStocksView extends Component {
    constructor(props)
    {
        super(props);
        this.timerId = 0;
    }

    componentDidMount() {
        // Refresh stock values every 15 minutes (900,000 milliseconds)
        this.timerId = setInterval(() => this.getData(), 900000);
    }

    componentWillUnmount() {
        /*
          stop getData() from continuing to run even
          after unmounting this component (when we change a page). 
        */
        clearTimeout(this.timerId);
    }

    getData = () => {
        this.props.setFinishedGettingPrices(false);
        this.props.getCurrentPrice(this.props.stocksArray);
    }

    render() {
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