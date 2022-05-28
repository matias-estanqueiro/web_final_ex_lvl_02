"use strict";

// There is no validation of existence because in the schema the values ​​are declared as required

const { check, validationResult } = require("express-validator");

const validatorUser = [
    check("name")
        // Elimina los espacios en blanco al principio y al final
        .trim()
        //'es-ES permite caracteres de idioma español (acentos, ñ, etc)
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 2, max: 90 })
        .withMessage("Character count: min 2; max 90"),

    check("surname")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 2, max: 90 })
        .withMessage("Character count: min 2; max 90"),

    check("birthdate")
        .trim()
        .isDate("MM-DD-YYYY")
        .withMessage("Enter valid date (MM-DD-YYYY)")
        .isBefore()
        .withMessage("The date cannot be later than the current date"),

    check("mail")
        .isEmail()
        .withMessage("Enter valid email address")
        // Normalizacion de email (minusculas)
        .normalizeEmail({ gmail_remove_dots: false }),

    check("password")
        .trim()
        .isStrongPassword()
        .withMessage(
            "This password must be at least 8 characters and contain at least one uppercase letter, one lower case letter, one number and one special alphanumeric character"
        ),

    check("address").trim(),

    check("phone").trim().isNumeric().withMessage("Only numbers"),

    (req, res, next) => {
        const errors = validationResult(req);
        // Si errors NO esta vacio
        !errors.isEmpty()
            ? res.status(400).json({ errores: errors.array() })
            : next();
    },
];

const validatorLoginUser = [
    // In login, only email is checked and not password since the password is controlled by comparing it with the one found in the DB, which already passed the controls at the time of creation
    check("mail")
        .isEmail()
        .withMessage("Enter valid email address")
        // Normalizacion de email (minusculas)
        .normalizeEmail({ gmail_remove_dots: false }),

    (req, res, next) => {
        const errors = validationResult(req);
        // Si errors NO esta vacio
        !errors.isEmpty()
            ? res.status(400).json({ errores: errors.array() })
            : next();
    },
];

module.exports = { validatorUser, validatorLoginUser };
