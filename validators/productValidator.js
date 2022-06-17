"use strict";

// The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
const fs = require("fs");

const { check, validationResult } = require("express-validator");

const validatorProduct = [
    check("name")
        .trim()
        .isAlphanumeric("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 10, max: 60 })
        .withMessage("Character count: min 10; max 60"),

    check("trademark")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 3, max: 20 })
        .withMessage("Character count: min 15; max 40"),

    check("description")
        .trim()
        .isLength({ min: 50 })
        .withMessage("Character min: 50"),

    check("price").trim().isNumeric().withMessage("Only numbers"),

    check("stock").trim().isNumeric().withMessage("Only numbers"),

    check("category")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please complete category"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(400).json(errors.array());
        } else next();
    },
];

module.exports = { validatorProduct };
