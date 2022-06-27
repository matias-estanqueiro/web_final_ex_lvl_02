"use strict";

require("dotenv").config();
require("./data/config");
const port = process.env.PORT;

const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// adds a middleware for serving static files to your Express app.
app.use(express.static("public"));
// express.json() is a built in middleware function in Express. It parses incoming JSON requests and puts the parsed data in req.body.

//bootstrap - static folder
app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// views - handlebars setup
const hbs = require("express-handlebars");
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs.engine({ extname: "hbs" }));

// frontend dev
app.get("/", (req, res) => {
    const content = `
    <h1>BACKEND_DRUMAT</h1>
    `;
    res.send(content);
});

// routes -> users
app.use("/user", require("./user/usersRoute"));

// routes -> items
app.use("/shop", require("./shop/productsRoute"));

// routes -> posts
app.use("/blog", require("./blog/postsRoute"));

// use --> Catch all route
app.use((req, res, next) => {
    let error = new Error();
    error.status = 404;
    error.message = "Resource not found";
    next(error);
});

// error Handler
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
        ? console.log(`Error: ${{ err: err.message }}`)
        : console.log(`App run at http://localhost:${port}`);
});
