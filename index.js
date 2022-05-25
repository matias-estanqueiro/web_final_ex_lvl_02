"use strict";

require("dotenv").config();
require("./data/config");
const port = process.env.PORT || 3000;

const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend dev
app.get("/", (req, res) => {
    const content = `
    <h1>BACKEND_DRUMAT</h1>
    `;
    res.send(content);
});

// routes -> USERS
app.use("/users", require("./users/usersRoute"));

// routes -> ITEMS
app.use("/shop", require("./shop/productsRoute"));

// routes -> POSTS
app.use("/blog", require("./blog/postsRoute"));

// USE --> Catch all route
app.use((req, res, next) => {
    let error = new Error();
    error.status = 404;
    error.message = "Resource not found";
    next(error);
});

// Error Handler
app.use((error, req, res, next) => {
    if (!error.status) {
        error.status = 500;
        error.message = "Internal server error";
    }
    res.status(error.status).json({
        status: error.status,
        message: error.message,
    });
});

// listen
app.listen(port, (err) => {
    err
        ? console.log(`Error: ${err}`)
        : console.log(`App run at http://localhost:${port}`);
});
