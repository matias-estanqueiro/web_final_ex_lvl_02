"use strict";

const router = require("express").Router();
const { validatorProduct } = require("../validators/productValidator");
const {
    listAllProducts,
    listCategoryProducts,
    listProductById,
    addProduct,
    removeProduct,
    modifyProduct,
} = require("./productsController");

// ------------------------------------------------------------- //

// get all products from the database
router.get("/", listAllProducts);

// get all the products of a category
router.get("/:category", listCategoryProducts);

router.get("/view-product/:id", listProductById);

// add new product (admin only function)
router.post("/add-product", validatorProduct, addProduct);

// delete product (admin only function)
router.delete("/remove/:id", removeProduct);

// modify existing product (admin only function)
router.post("/update/:id", validatorProduct, modifyProduct);

module.exports = router;
