const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`App is listening on http://localhost:${port}`.yellow.bold ));