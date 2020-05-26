/*
    * This file contains the schema and model for a single Stock (that has been bought).
    * A stock (that has been bought) will have the following information stored:
    * - stock symbol/name to identify it
    * - email (user) who bought the stock
    * - quantity that the user bought
*/
var mongoose = require('mongoose');

var stockSchema = new mongoose.Schema({
    tickerSymbol: String,
    email: String,
    quantity: Number
});

module.exports = mongoose.model('Stock', stockSchema);