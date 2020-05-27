import React, { useState } from "react";
import axios from 'axios';
import LoginView from '../views/LoginView';
import AlertDimissable from '../views/AlertView';
import '../styles/Login.css';
import { connect } from "react-redux";
import { setLoggedIn } from '../store/rootReducer';
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAlert, setLoginAlert] = useState(null);
  const history = useHistory();

  function validateForm() 
  {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event)
  {
    event.preventDefault();
    // Make an axios call to the backend to attempt to login the user
    axios.get("http://localhost:5000/user/login/" + email + "/password/" + password).then(res => {
      if (res.data.success === true) { // Successful login
        // Change loggedIn backend State variable
        setLoginAlert(<AlertDimissable 
          setLoginAlert={setLoginAlert} 
          setRegistrationAlert="n/a"
          className="login-alert"
          validity="true" 
          message={res.data.message} 
          message2="Hooray! Now you can view and buy stocks."
          alertClass="flexible-container"
        />);
        props.setLoggedIn(true);
        history.push("/"); // Redirect to homepage
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

// Match state variables to props of this component
// prop_var_name: state.var_name_in_state
function mapStateToProps(state) {
  return {
    loggedIn: state.loggedIn
  }
}

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
  return {
    setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);