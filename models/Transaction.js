/*
    * This file contains the schema and model for a single Transaction.
    * A transaction will have the following information stored:
    * - email (user) who performed the transaction/is associated with it
    * - stock symbol/name that was bought in the transaction
    * - the quantity of stock bought
    * - the total cost of the transaction
    * - the time the stock was purchased
*/

var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    email: String,
    tickerSymbol: String,
    quantity: Number,
    totalCost: Number,
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);