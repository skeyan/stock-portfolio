import React, { Component } from 'react';
import "../styles/Login.css";
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

class RegisterView extends Component {
    render() {
        return (
            <div>
                { this.props.registrationAlert }
                <div className="Login">
                    <form onSubmit={this.props.handleSubmit}>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Full Name</ControlLabel>
                            <FormControl
                            autoFocus
                            type="text"
                            value={this.props.name}
                            onChange={e => this.props.setName(e.target.value)}
                            className="form-input"
                            />
                        </FormGroup>
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
                            Register
                        </Button>
                        <p className="no-account">Already have an account? <Link to="/login">Login here.</Link></p>
                    </form>
                
                    
                </div>
            </div>
        );
    }
}

// Connect this component to the store
export default RegisterView;