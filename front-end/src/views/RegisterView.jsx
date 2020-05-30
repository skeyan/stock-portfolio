import React  from 'react';
import "../styles/Login.css";
import '../styles/Portfolio.css';
import '../styles/Fonts.css';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

const RegisterView = props => {
    return (
        <div>
            { props.registrationAlert }
            <div className="Login">
                <form onSubmit={props.handleSubmit}>
                    <FormGroup bsSize="large">
                        <ControlLabel>Full Name</ControlLabel>
                        <FormControl
                        autoFocus
                        type="text"
                        value={props.name}
                        onChange={e => props.setName(e.target.value)}
                        className="form-input"
                        />
                    </FormGroup>
                    <FormGroup controlId="email" bsSize="large" >
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
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
                        Register
                    </Button>
                    <p className="no-account">Already have an account? <Link to="/login">Login here.</Link></p>
                </form>
            
                
            </div>
        </div>
    );
}

// Connect this component to the store
export default RegisterView;