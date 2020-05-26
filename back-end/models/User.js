/*
    * This file contains the schema and model for a single User.
    * A user will have the following information stored:
    * - name
    * - email
    * - password (will be hashed)
    * - current cash balance (default: $5000)
*/
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cashBalance: Number
});

module.exports = mongoose.model('User', userSchema);