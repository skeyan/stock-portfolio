var express = require ('express');
var router = express.Router();

router.get("/hi", function (req, res) {
    console.log("HELLO WORLD");
}) 

// Handle post requests from the front end with a payload
// Used to register a user?
router.post("/login", function (req, res) {
    console.log("Stuff has been posted", req.body)
}) 

module.exports = router;
