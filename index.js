const express = require('express')
const app = express()
const cors = require('cors')

require('dotenv').config();

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded()); // read the url parameters properly
app.use(bodyParser.json()); // converts json into js objects

// cors for cross-origin-requests (hitting endpoint from a browser)
// for using localhost:3000 and localhost:3500
app.use(cors());

// connect to mongoose
const mongoose = require("mongoose")
mongoose.connect(
    process.env.REACT_APP_ATLAS_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
)

// pending connection - notify when connected
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Successfully connected to MongoDB database");
});

const user = require('./routes/UserRoute.js');
const transaction = require('./routes/TransactionRoute.js');
const stock = require('./routes/StockRoute.js');

// routing
// organize endpoints
app.use('/user', user);
app.use('/transaction', transaction);
app.use('/stock', stock);

// This app starts a server and listens on port 3500 for connections.
// The app responds with “Hello World!” for requests to the root URL (/) or route.
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.BACKEND_PORT || 3500, () => console.log(`App listening at http://localhost:${process.env.BACKEND_PORT}`))