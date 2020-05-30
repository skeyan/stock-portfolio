const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded()); // read the url parameters properly
app.use(bodyParser.json()); // converts json into js objects

// cors for cross-origin-requests (hitting endpoint from a browser)
// for using localhost:3000 and localhost:5000
app.use(cors());

// connect to mongoose
const mongoose = require("mongoose")
mongoose.connect(
    "mongodb+srv://Eva:test123@stockfolio-m97hy.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
)

// pending connection - notify when connected
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("successfully connected to mongo database");
});

const user = require('./routes/UserRoute.js');
const transaction = require('./routes/TransactionRoute.js');
const stock = require('./routes/StockRoute.js');

// routing
// organize endpoints
app.use('/user', user);
app.use('/transaction', transaction);
app.use('/stock', stock);

// This app starts a server and listens on port 5000 for connections.
// The app responds with “Hello World!” for requests to the root URL (/) or route. 
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT || port, () => console.log(`App listening at http://localhost:${port}`))