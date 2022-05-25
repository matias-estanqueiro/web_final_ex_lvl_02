"use strict";

// Configuration and connection with MongoDB cluster through mongoose

const mongoose = require("mongoose");
// Uniform Resource Identifier (connection string)
const uri = process.env.DB_URI;
const options = {
    maxPoolSize: 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
mongoose.connect(uri, options, (err) => {
    err ? console.log(err) : console.log("MongoDB + Atlas connected OK!");
});
