var express = require ('express');
var router = express.Router();
var User = require ('../models/User.js');

// Handle post requests from the front end with a payload
// Used to register a user
router.post("/register", function (req, res) {
    // Check if the user (email) already exists in the database
    // Go through all the users in the User table to see if it exists
    // Success: emails contains all of the matches
    // Failure: err contains error
    User.find({ email: req.body.email }, (err, emails) => {
        console.log("EMAILS: ", emails);
        if (err) {
            console.log(err);
            res.send({
                success: false,
                message: err // send the error object
            })
        }
        if (emails.length > 0) { // emails exist
            console.log("EMAIL ALREADY EXISTS, SHOULD NOT REGISTER NEW USER");
            res.send({
                success: false,
                message: "Unsuccessful registration, email already exists."
            })
        } 
        else {
            console.log("EMAIL DOESN'T EXIST YET, CAN REGISTER NEW USER");
            // Create an instance (document) of a user model 
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                cashBalance: req.body.cashBalance
            });

            // Save the new user into the database
            user.save(err => { 
                if (err) console.log(err);
            })
            res.send({
                success: true,
                message: "Successful registration, new user created."
            })
        }
    }) 
    // console.log(user);
    // res.end();
    // res.send(req.body);
}) 

module.exports = router;
