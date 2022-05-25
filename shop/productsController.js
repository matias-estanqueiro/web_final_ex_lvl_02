"use strict";

const Product = require("./productsModel");

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

// add a new product (administrator only function)
const addProduct = async (req, res, next) => {
    try {
        const newProduct = new Product({ ...req.body });
        const result = await newProduct.save();
        res.status(201).json(result);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// delete product (administrator only function)
const removeProduct = async (req, res, next) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    !result ? next() : res.status(200).json(result);
};

// modify existing product (administrator only function)
const modifyProduct = async (req, res, next) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(result);
    } catch (error) {
        error.status = 404;
        next(error);
    }
};

module.exports = {
    listAllProducts,
    listCategoryProducts,
    listProductById,
    addProduct,
    removeProduct,
    modifyProduct,
};
