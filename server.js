// const express = require('express');
const app = require("./app");
require('dotenv').config();
// const app = express();
const connetctTOMongo = require('./config/db');
const PORT = process.env.PORT || 5000;

connetctTOMongo();

require('./cpu-moniter');

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});