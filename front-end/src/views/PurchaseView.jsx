import React, { Component } from 'react';

class PurchaseView extends Component {
    constructor()
    {
        super();

        // Default state values go below
        this.state = {
            // Default values, currently hardcoded
        }
    }

    render() {
        return (
            <div>
                Debug: PurchaseView
                <h3>Cash:</h3> 
                <p>${this.props.cash}</p>
            </div>
        );
    }
}

export default PurchaseView;