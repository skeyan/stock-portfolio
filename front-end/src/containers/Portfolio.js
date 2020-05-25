import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Portfolio.css';
import PurchaseView from '../views/PurchaseView';
import { connect } from "react-redux";
import { setCash } from '../store/rootReducer';

class Portfolio extends Component {
    constructor()
    {
        super();

        // Default state values go below
        this.state = {
            // Default values, currently hardcoded
            cash: 5000
        }
    }

    componentDidMount() {
        this.setState({
          cash: this.props.cash
        })
        this.props.setCash(5000);
    }

    render() {
        console.log(this.props.cash)
        return (
            <div className="portfolio-container">
                Debug: Portfolio
                <h3 id="portfolio-header">$USER's Portfolio ($$AMOUNT_WITH_STOCKS)</h3>

                {/* PurchaseView is the component where the user can purchase stocks. */}
                <PurchaseView cash={this.props.cash} />
            </div>
        );
    }
}

// Match state variables to props of this component
function mapStateToProps(state) {
    return {
      // prop_var_name: state.var_name_in_state
      cash: state.cash
    }
  }

// Map dispatch functions to props of this component
const mapDispatchToProps = dispatch => {
    return {
      // action: (variable) => dispatch (action(variable))
      setCash: (cash) => dispatch(setCash(cash))
    }
  };


// Connect this component to the store
export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);