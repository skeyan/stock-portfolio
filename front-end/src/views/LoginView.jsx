import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../styles/Login.css";

class LoginView extends Component {
    render() {
        return (
            <div className="Login">
                <form onSubmit={this.props.handleSubmit}>
                <FormGroup controlId="email" bsSize="large" >
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                    autoFocus
                    type="email"
                    value={this.props.email}
                    onChange={e => this.props.setEmail(e.target.value)}
                    className="form-input"
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                    value={this.props.password}
                    onChange={e => this.props.setPassword(e.target.value)}
                    type="password"
                    className="form-input"
                    />
                </FormGroup>
                <Button block bsSize="large" disabled={!this.props.validateForm()} type="submit">
                    Login
                </Button>
                <p className="no-account">Don't have an account? <Link to="/register">Register here.</Link></p>
                </form>
            
                
            </div>
        );
    }
}

// Connect this component to the store
export default LoginView;