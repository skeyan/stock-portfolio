import React, { useState } from "react";
import axios from 'axios';
import LoginView from '../views/LoginView';
import AlertDimissable from '../views/AlertView';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAlert, setLoginAlert] = useState(null);

  function validateForm() 
  {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) 
  {
    event.preventDefault();
    // let loginInfo = {
    //   email: email,
    //   password: password
    // }
    // console.log(loginInfo)

    // Make an axios call to the backend to attempt to login the user
    axios.get("http://localhost:5000/user/login/" + email + "/password/" + password).then(res => {
      // console.log("LOGIN RESPONSE:", res.data.message);
      if (res.data.success === true) { // Successful login
        setLoginAlert(<AlertDimissable 
          setLoginAlert={setLoginAlert} 
          setRegistrationAlert="n/a"
          className="login-alert"
          validity="true" 
          message={res.data.message} 
          message2="Hooray! Now you can view and buy stocks."
          alertClass="flexible-container"
        />);
      }
      else { // Unsuccessful login
        setLoginAlert(<AlertDimissable 
          setLoginAlert={setLoginAlert} 
          className="login-alert"
          setRegistrationAlert="n/a"
          validity="false" 
          message="Unable to login."
          errorMessage={res.data.message}
          alertClass="flexible-container"
        />);
      }
    }).catch(err => {
      // Unsuccessful GET request
      setLoginAlert(<AlertDimissable 
        className="login-alert"
        setLoginAlert={setLoginAlert}
        setRegistrationAlert="n/a" 
        validity="false" 
        message="Unable to login."
        errorMessage="Bad endpoint."
        alertClass="flexible-container"
      />);
    })
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
            loginAlert={loginAlert}
        />
      </div>
    </div>
  );
}