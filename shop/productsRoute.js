"use strict";

const router = require("express").Router();
const { validatorProduct } = require("../validators/productValidator");
const isAuth = require("../utils/handleAuthorization");
const fileUpload = require("../utils/handleStorage");
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
router.post(
    "/add-product",
    isAuth,
    fileUpload.single("file"),
    validatorProduct,
    addProduct
);

// delete product (admin only function)
router.delete("/remove/:id", isAuth, removeProduct);

// modify existing product (admin only function)
router.post("/update/:id", isAuth, modifyProduct);

module.exports = router;
