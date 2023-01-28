const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const user = require('./user/UserRouter');
dotenv.config();

const app = express();

app.use(express.json());
//roures
app.use('/',user);  

module.exports = app;