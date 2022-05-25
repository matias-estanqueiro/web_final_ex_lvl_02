"use strict";

// There is no validation of existence because in the schema the values ​​are declared as required

const { check, validationResult } = require("express-validator");

const validatorProduct = [
    check("name")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 15, max: 60 })
        .withMessage("Character count: min 15; max 60"),

    check("description")
        .trim()
        .isLength({ min: 2, max: 155 })
        .withMessage("Character max: 155"),

    check("price").trim().isNumeric().withMessage("Only numbers"),

    check("stock").trim().isNumeric().withMessage("Only numbers"),

    (req, res, next) => {
        const errors = validationResult(req);
        // Si errors NO esta vacio
        !errors.isEmpty()
            ? res.status(400).json({ errores: errors.array() })
            : next();
    },
];

module.exports = { validatorProduct };
