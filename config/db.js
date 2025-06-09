// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = () => {
    try {
        mongoose.connect(process.env.MONGOURI);
        console.log("Connected to MongoDB Sucessfully.");
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
    }
    // mongoose.connect(process.env.MONGOURI)
    // .then(()=> console.log(`Connected to MongoDB Sucessfully.`))
    // .catch((error) => console.error(`MongoDB connection failed: ${error.message}`));
}

module.exports = connectToMongo;