import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../styles/Login.css";
import '../styles/Portfolio.css';

const LoginView = props => {
    return (
        <div>
            { props.loginAlert }
            <div className="Login">
                <form onSubmit={props.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large" >
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                        autoFocus
                        type="email"
                        value={props.email}
                        onChange={e => props.setEmail(e.target.value)}
                        className="form-input"
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                        value={props.password}
                        onChange={e => props.setPassword(e.target.value)}
                        type="password"
                        className="form-input"
                        />
                    </FormGroup>
                    <Button block bsSize="large" disabled={!props.validateForm()} type="submit">
                        Login
                    </Button>
                    <p className="no-account">Don't have an account? <Link to="/register">Register here.</Link></p>
                </form> 
            </div>
        </div>
    );
}

export default LoginView;