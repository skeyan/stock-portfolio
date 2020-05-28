var express = require ('express');
var router = express.Router();
var Transaction = require ('../models/Transaction.js');

// @pre User is logged in
// Get all of the user's transactions (get transaction history)
router.get("/email/:email", function (req, res) {
    // Search database for transactions
    Transaction.find({ email: req.params.email }, (err, transactions) => {
        if (err) {
            res.send({
                success: false,
                message: "Error searching for transactions."
            })
        }
        else {
            res.send({
                success: true,
                data: transactions,
                message: "Successfully retrieved transaction history."
            })
        }
    })
})

// @pre User is logged in and has just purchased a stock
// Add a transaction to the database
router.post("/new", function (req, res) {
    // Create an instance (document) of a new transaction model
    const transaction = new Transaction({
        email: req.body.email,
        tickerSymbol: req.body.tickerSymbol,
        quantity: req.body.quantity,
        totalCost: req.body.totalCost
    });

    // Save the new transaction into the database
    transaction.save((err) => {
        if (err) {
            res.send({
                success: false,
                message: "Error saving transaction."
            })
        }
        else {
            // console.log(transaction)
            res.send({
                success: true,
                message: "Successfully completed transaction."
            })
        }
    })
})

module.exports = router;
