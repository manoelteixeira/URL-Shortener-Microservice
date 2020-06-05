// server.js

const morgan = require('morgan');
const errorHandler = require('errorhandler');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const express = require('express');

const {checkDatabase} = require('./database/database');

checkDatabase();

const app = express();
const PORT = config.PORT;



app.use(bodyParser.json());
app.use(errorHandler());
app.use(cors());
app.use(morgan('dev'));

const apiRouter = require('./routes/api');
app.use('/', apiRouter);



app.listen(PORT, () => {
    console.log(`Server Running on PORT: ${PORT}.`);
});

module.exports = app;