const express = require('express');

const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const mongoDB = require("./db.js");

const list_Routes = require('./Routes/Lists');
const user_Routes = require('./Routes/Users');
const email_Routes = require('./Routes/Email');
const unsubscribe_Routes = require('./Routes/Unsubscribe');

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoDB;

app.use('/api', list_Routes);
app.use('/api', user_Routes);
app.use('/api', email_Routes);
app.use('/api', unsubscribe_Routes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
