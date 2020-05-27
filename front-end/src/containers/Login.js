import React, { useState } from "react";
import axios from 'axios';
import LoginView from '../views/LoginView';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() 
  {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) 
  {
    event.preventDefault();
  }

  return (
    <div className="login-parent">
      <div className="login-container">
        <h2>| Login</h2>
        <LoginView 
            setEmail={setEmail} 
            setPassword={setPassword}
            email={email} password={password}
            validateForm={validateForm}
            handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}