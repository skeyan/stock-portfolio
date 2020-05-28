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
                message: "Error in user search."
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
                message:  "Error in user search."
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
                    cashBalance: req.body.cashBalance,
                    totalTransactions: req.body.totalTransactions
                });

                // Save the new user into the database
                user.save(err => { 
                    if (err) {
                        res.send({
                            success: false,
                            message: "Error saving user."
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

// @pre User is logged in
// Get the user's current cash balance
router.get("/email/:email/cash", function (req, res) {
    // Find all stocks that belong to the user, if any
    User.findOne({ email: req.params.email }, (err, user) => {
        if (err) { // find error 
            res.send({
                success: false,
                message: "User search unsuccessful."
            })
        }
        if (user) { // User exists
            res.send({
                success: true,
                data: user.cashBalance,
                message: "Successfully retrieved cash balance."
            })
        }
        else { // User doesn't exist
            res.send({
                success: false,
                message: "User doesn't exist.",
            })
        }
    })
})

// @pre user is logged in
// Get user num transactions
router.get("/email/:email/number", function (req, res) {
    // Find all stocks that belong to the user, if any
    User.findOne({ email: req.params.email }, (err, user) => {
        if (err) { // find error 
            res.send({
                success: false,
                message: "User search unsuccessful."
            })
        }
        if (user) { // User exists
            res.send({
                success: true,
                data: user.totalTransactions,
                message: "Successfully retrieved number of transactions."
            })
        }
        else { // User doesn't exist
            res.send({
                success: false,
                message: "User doesn't exist.",
            })
        }
    })
})

// @pre User is logged in.
// need email, new transaction number
// Update user transactions total number
router.post("/transactions/update", function(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.send({
                success: false,
                message: "Error finding user."
            })
        }
        if (user) { // found the user
            // update total num transactions
            let newNumTransactions = Number(req.body.totalTransactions);
            User.updateOne({ "email": req.body.email }, 
            {
                $set: { totalTransactions: newNumTransactions }
            }).then(
                res.send({
                    success: true,
                    message: "Successfully updated user's total number of transactions."
                })
            ).catch = (err) => (
                res.send({
                    success: false,
                    message: err
                })
            )
        } else { // user not found
            res.send({
                success: false,
                message: "User not found."
            })
        }
    })
})


// @pre User is logged in.
// Needs email, new cash balance
// Update user's cash balance
router.post("/balance/update", function(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            res.send({
                success: false,
                message: "Error finding user."
            })
        }
        if (user) { // found the user
            // update cash balance
            let newBalance = Number(req.body.cashBalance);
            User.updateOne({ "email": req.body.email }, 
            {
                $set: { cashBalance: newBalance }
            }).then(
                res.send({
                    success: true,
                    message: "Successfully updated user's cash balance."
                })
            ).catch = (err) => (
                res.send({
                    success: false,
                    message: err
                })
            )
        } else { // user not found
            res.send({
                success: false,
                message: "User not found."
            })
        }
    })
})

module.exports = router;
