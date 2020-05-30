import React, { useState } from "react";
import RegisterView from '../views/RegisterView';
import AlertDimissable from '../views/AlertView'; 
import { Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registrationAlert, setRegistrationAlert] = useState(null);
  
    function validateForm() 
    {
      return name.length > 0 && email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) 
    {
        event.preventDefault();

        let data = {
            name:name, 
            email:email, 
            password:password,
            cashBalance: 5000,
            totalTransactions: 0
        }

        // Make an axios call to the backend to attempt to register the user
        axios.post("https://stockfolio-app-back.herokuapp.com/user/register", data).then(res => {  
            // Successful POST request
            // console.log("REGISTRATION RESPONSE:", res);
            if (res.data.success === true) // Successful registration
            {
                setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        setLoginAlert="n/a"
                                        validity="true" 
                                        message={res.data.message} 
                                        message2={<Link to="/login">Login here.</Link>}
                                        alertClass="flexible-container"
                                    />);
                setName("");
                setPassword("");
                setEmail("");
            }   
            else // Unsuccessful registration
            {
                setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        setLoginAlert="n/a"
                                        validity="false" 
                                        message={res.data.message} 
                                        errorMessage="Try a different email."
                                        alertClass="flexible-container"
                                    />);
            }

        }).catch(err => {
            // Unsuccessful POST request
            setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        setLoginAlert="n/a"
                                        validity="false" 
                                        message="Unable to register." 
                                        errorMessage="Bad endpoint."
                                        alertClass="flexible-container"
                                />);
        });
    }
    
    return (
        <div className="login-parent">
            <div className="login-container">
                <h2>| Register</h2>
                <RegisterView handleSubmit={handleSubmit} 
                            validateForm={validateForm} 
                            setName={setName} setEmail={setEmail} setPassword={setPassword}
                            name={name} email={email} password={password}
                            registrationAlert={registrationAlert}
                />
            </div>
        </div>
    );
  }