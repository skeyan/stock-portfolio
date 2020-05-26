import React, { Component } from 'react';
import { Button, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import { setError } from '../store/rootReducer';
import '../styles/Portfolio.css';

class AlertDismissable extends Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleDismiss = this.handleDismiss.bind(this);
      this.handleShow = this.handleShow.bind(this);
  
      this.state = {
        show: true
      };
    }
  
    // Closes the alert component through conditional rendering
    handleDismiss() {
      this.setState({ show: false });
      this.props.setError("");
    }
  
    // Shows (renders) the alert component through conditional rendering
    handleShow() {
      this.setState({ show: true });
    }
  
    render() {
      if (this.state.show) { // Show something only if it should
        if (this.props.validity !== "true") // Show a failure alert if the purchase wasn't successful
        {
            return (
                <div className="alert-container">
                    <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                        <h4>Oh snap! The purchase didn't go through.</h4>
                        <p>
                        { this.props.error }
                        </p>
                        <p>
                        <Button onClick={this.handleDismiss}>Close</Button>
                        </p>
                    </Alert>
              </div>
            );
        }
        else // Show a successful alert if the purchase was a success
        {
            return (
                <div className="alert-container">
                    <Alert bsStyle="success" onDismiss={this.handleDismiss}>
                        <h4>Successful purchase!</h4>
                        <p>
                            Go to Transactions to audit your stocks.
                        </p>
                        <p>
                        <Button onClick={this.handleDismiss}>Close</Button>
                        </p>
                    </Alert>
              </div>
            );
        }
      }
      return null; // Show nothing if closed/dismissed
    }
  }

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
    return {
        error: state.error
    }
  }

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
    return {
        setError: (error) => dispatch(setError(error))
    }
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(AlertDismissable);