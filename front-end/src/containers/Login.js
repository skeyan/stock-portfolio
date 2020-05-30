import React, { useState } from "react";
import axios from 'axios';
import LoginView from '../views/LoginView';
import AlertDimissable from '../views/AlertView';
import '../styles/Login.css';
import '../styles/Fonts.css';
import { connect } from "react-redux";
import { setLoggedIn, setCurrentUser, getNumTransactions, getCash, getStocks, getCurrentPrice } from '../store/rootReducer';
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

  // Login form submission
  function handleSubmit(event)
  {
    event.preventDefault();
    // Make an axios call to the backend to attempt to login the user
    axios.get("https://stockfolio-back-end.herokuapp.com/user/login/" + email + "/password/" + password).then(res => {
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
        props.setLoggedIn(true); // set status on frontend
        props.setCurrentUser(email); // set current user on frontend
        props.getNumTransactions(); // get and set current user's total num transactions on frontend
        props.getCash(); // get and set current user's amount of cash they have to buy stocks on frontend
        props.getStocks(); // get (and set) current user's stocks list on frontend
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
    loggedIn: state.loggedIn,
  }
}

// Map dispatch functions to props of this component
// action: (variable) => dispatch (action(variable))
const mapDispatchToProps = dispatch => {
  return {
    setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
    setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser)),
    getNumTransactions: () => dispatch(getNumTransactions()),
    getCash: () => dispatch(getCash()),
    getStocks: () => dispatch(getStocks()),
    getCurrentPrice: (symbol) => dispatch(getCurrentPrice(symbol))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);