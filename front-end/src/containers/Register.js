import React, { useState } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../styles/Login.css";
import axios from "axios";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    function validateForm() 
    {
      return name.length > 0 && email.length > 0 && password.length > 4;
    }
  
    function handleSubmit(event) 
    {
        event.preventDefault();

        let data = {
            name:name, 
            email:email, 
            password:password,
            cashBalance: 5000
        }

        // Make an axios call to the backend to attempt to register the user
        axios.post("http://localhost:5000/user/register", data).then(res => { 
                console.log(res);
                console.log("hi");
        }).catch(

        );
    }
    
    return (
      <div className="Login">
        <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Full Name</ControlLabel>
            <FormControl
              autoFocus
              type="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              className="form-input"
            />
          </FormGroup>
          <Button block bsSize="large" disabled={!validateForm()} type="submit">
            Register
          </Button>
          <p id="no-account">Already have an account? Login here.</p>
        </form>
       
        
      </div>
    );
  }