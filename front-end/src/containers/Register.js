import React, { useState } from "react";
import RegisterView from '../views/RegisterView';
import AlertDimissable from '../views/AlertView';
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
            cashBalance: 5000
        }

        // Make an axios call to the backend to attempt to register the user
        axios.post("http://localhost:5000/user/register", data).then(res => {  
            // Successful post request
            console.log("RESPONSE:", res);
            if (res.data.success === true) // Successful registration
            {
                setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        validity="true" 
                                        message={res.data.message} 
                                        message2=""
                                    />);
            }   
            else // Unsuccessful registration
            {
                setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        validity="false" 
                                        message={res.data.message} 
                                        error="Try a different email."
                                    />);
            }

        }).catch(err => {
            // Unsuccessful post request
            setRegistrationAlert(<AlertDimissable 
                                        setRegistrationAlert={setRegistrationAlert} 
                                        validity="false" 
                                        message="Unable to register." 
                                        error="Bad endpoint."
                                />);
            console.log("ERROR:", err);
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
                            registrationAlert={registrationAlert} setRegistrationAlert={setRegistrationAlert}
                />
            </div>
        </div>
    );
  }