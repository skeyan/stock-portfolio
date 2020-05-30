var express = require ('express');
var router = express.Router();
var Stock = require ('../models/Stock.js');

// @pre User is logged in
// Get all of the user's stocks
router.get("/email/:email/all", function (req, res) {
    // Find all stocks that belong to the user, if any
    Stock.find({ email: req.params.email }, (err, stocks) => {
        if (err) { // find error 
            res.send({
                success: false,
                message: "Stock find error."
            })
        }
        if (stocks.length < 0 || !stocks) { // user has no matching stocks, hasn't bought any yet
            res.send({
                success: true,
                message: "User has no stocks."
            })
        }
        else { // user has stocks
            res.send({
                success: true,
                message: "Found the stocks successfully.",
                data: stocks
            })
        }
    })
})

// @pre User is logged in
// Get the quantity (shares) of one of the user's stocks
router.get("/email/:email/ticker/:tickerSymbol", function (req, res) {
    Stock.findOne({ email: req.params.email, tickerSymbol: req.params.tickerSymbol }, (err, stock) => {
        if (err) { // find error 
            res.send({
                success: false,
                message: "Stock find error."
            })
        }
        if (stock) { // found the stock corresponding to the user
            res.send({
                success: true,
                message: "Successfully found the stock.",
                data: stock.quantity
            })
        }
        else { // didn't find the stock corresponding to the user
            res.send({
                success: true,
                message: "User doesn't have the stock."
            })
        }
    })
})

// @pre User is logged in and has passed in tickerSymbol, email, and quantity via req body (just purchased a stock)
// Update the quantity (shares) of one of the user's stocks,
// or add a new stock with a certain quantity if they don't have it yet
// Takes in a payload of the necessary data
router.post("/update", function (req, res) {
    // Do different things depending on if the user has the stock already or not
    Stock.findOne({ email: req.body.email, tickerSymbol: req.body.tickerSymbol }, (err, stock) => {
        if(err) {
            res.send({
                success: false,
                message: "Error finding stock."
            })
        }
        if(stock) { // User has already bought the stock before -> only update the quantity
            // console.log(stock, stock.quantity);
            // Update the info of the stock
            const newQuantity = stock.quantity + Number(req.body.quantity);
            console.log(newQuantity);
            Stock.updateOne({ "email": req.body.email, "tickerSymbol": req.body.tickerSymbol }, 
            {
                $set: { quantity: newQuantity }
            }).then(
                res.send({
                    success: true,
                    message: "Successfully updated stock quantity."
                })
            )
        }
        else { // User hasn't bought the stock before -> add a new stock with quantity
            const stock = new Stock({
                tickerSymbol: req.body.tickerSymbol,
                email: req.body.email,
                quantity: req.body.quantity // aka # shares
            })

            // Save the stock into the database
            stock.save(error => {
                if (error) {
                    console.log(error);
                    res.send({
                        success: false,
                        message: "Error saving stock into database."
                    })
                }
                else {
                    // Send a object message to alert the front-end of what happened here
                    res.send({
                        success: true,
                        message: "Successfully added new stock."
                    })
                }
            })
        }
    })
})

module.exports = router;
