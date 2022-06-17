"use strict";

const Product = require("./productsModel");
// Extracts data validated or sanitized by express-validator from the request and builds an object with them
const { matchedData } = require("express-validator");
// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");
// The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
const fs = require("fs");

// ------------------------------------------------------------- //

// get all products from the database
const listAllProducts = async (req, res, next) => {
    const result = await Product.find();
    !result.length ? next() : res.status(200).json(result);
};

// get all the products of a category
const listCategoryProducts = async (req, res, next) => {
    const result = await Product.find({ category: req.params.category });
    result.length ? res.status(200).json(result) : next();
};

// get a specific product
const listProductById = async (req, res, next) => {
    // I tried to use .findById() but it did not return the result of the query. That's why .find() was used
    const result = await Product.find({ _id: req.params.id });
    !result.length ? next() : res.status(200).json(result);
};

// add a new product
const addProduct = async (req, res, next) => {
    const cleanReq = matchedData(req);
    let file = null;
    req.file
        ? (file = `${process.env.PUBLIC_URL}/${req.file.filename}`)
        : // Generic file (image) in case that the user dont upload it
          (file = `${process.env.PUBLIC_URL}/img-no-product.png`);
    // Assigning file to the user record
    const newProduct = new Product({ ...req.body, file });
    try {
        const result = await newProduct.save();
        res.status(201).json({
            message: `${result.name} successfully added!`,
            newProduct,
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        error.status = 400;
        next(error);
    }
};

// delete product
const removeProduct = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await Product.findByIdAndDelete(req.params.id);
    !result
        ? next()
        : res
              .status(200)
              .json({ message: `${result.name} removed successfully` });
};

// modify existing product
const modifyProduct = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    !result
        ? next()
        : res.status(200).json({
              message: `${result.name} successfully modified`,
          });
};

module.exports = {
    listAllProducts,
    listCategoryProducts,
    listProductById,
    addProduct,
    removeProduct,
    modifyProduct,
};
