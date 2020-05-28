var express = require ('express');
var router = express.Router();
var User = require ('../models/User.js');

// Hash and compare passwords with the bcrypt library
const bcrypt = require('bcrypt');
const saltRounds = 10;

// @pre User has submitted the login form 
// Handle GET requests from the front end with a payload to the /login path
// Compares the user's password with bcrypt
// Used to login a user
    // Check if user's email exists in database
    // If so, use bcrypt to compare passwords
router.get("/login/:email/password/:password", function (req, res) {
    // Check if the user (email) already exists in the database
    // Go through all the users in the User table to see if it exists
    User.findOne({ email: req.params.email }, (err, user) => {
        if (err) { // find error --> cannot login
            res.send({
                success: false,
                message: err // send the error object
            })
        }
        if (!user) { // user (email) doesn't exist in database, not yet registered
            res.send({
                success: false,
                message: "User does not exist."
            })
        }
        else { // user (email) exists in database, so move onto compare passwords now
            // Compare the passwords asychronously with bcrypt
            bcrypt.compare(req.params.password, user.password, function(bErr, bRes) {
                if(bRes) { // Passwords match -> tell frontend to login the user.
                    res.send({
                        success: true,
                        message: "Successful login."
                    })
                }
                else { // Passwords don't match -> tell frontend to NOT login the user.
                    res.send({
                        success: false,
                        message: "Wrong password."
                    })
                }
            })
        }
    })
})

// @pre User has submitted the registration form
// Handle POST requests from the front end with a payload to the /register path
// Hashes the user's password with bcrypt
// Used to register a user
    // Check if entered email exists in database
    // If not, register new user with that email
router.post("/register", function (req, res) {
    // Check if the user (email) already exists in the database
    // Go through all the users in the User table to see if it exists
    User.find({ email: req.body.email }, (err, emails) => {
        // console.log("EMAILS: ", emails);
        if (err) { // find error -> cannot register
            res.send({
                success: false,
                message: err // send the error object
            })
        }
        if (emails.length > 0) { // email already exists -> cannot register
            res.send({
                success: false,
                message: "Unsuccessful registration, email already exists."
            })
        } 
        else { // email doesn't exist yet -> can register the new user
            // Hash their password asynchronously, create user, and store in database.
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                // Create an instance (document) of a user model 
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    cashBalance: req.body.cashBalance
                });

                // Save the new user into the database
                user.save(err => { 
                    if (err) {
                        console.log(err);
                        res.send({
                            success: false,
                            message: err
                        })
                    }
                    else {
                        // Send a object message to alert the front-end of what happened here
                        res.send({
                            success: true,
                            message: "Successful registration, new user created."
                        })
                    }
                })
            });
        }
    }) 
}) 

module.exports = router;
