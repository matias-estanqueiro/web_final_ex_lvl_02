"use strict";

// The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
const fs = require("fs");

const { check, validationResult } = require("express-validator");

const validatorUser = [
    check("name")
        // Remove leading and trailing whitespace
        .trim()
        // 'es-ES allows Spanish language characters (accents, ñ, etc)
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 2, max: 90 })
        .withMessage("The name must contain at least 2 letters"),

    check("surname")
        .trim()
        .isAlpha("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space")
        .isLength({ min: 2, max: 90 })
        .withMessage("The surname must contain at least 2 letters"),

    check("birthdate")
        .trim()
        .isDate("YYYY-MM-DD")
        .withMessage("Enter valid date (YYY-MM-DD)")
        .isBefore()
        .withMessage("The date cannot be later than the current date"),

    check("mail")
        .trim()
        .isEmail()
        .withMessage("Enter valid email address")
        // Email normalization (lowercase)
        .normalizeEmail({ gmail_remove_dots: false }),

    check("password")
        .trim()
        .isStrongPassword()
        .withMessage(
            "This password must be at least 8 characters and contain at least one uppercase letter, one lower case letter, one number and one special alphanumeric character"
        ),

    check("country")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please select country"),

    check("state").trim().not().isEmpty().withMessage("Please select country"),

    check("address")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Please complete address")
        .isAlphanumeric("en-US", { ignore: " " })
        .withMessage("Only letters & intermediate space"),

    check("admin").trim(),

    check("phone")
        .trim()
        .isNumeric()
        .withMessage(
            "It is only allowed to complete the telephone field with numbers"
        ),

    check("file").trim(),

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

const validatorLoginUser = [
    // In login, only email is checked and not password since the password is controlled by comparing it with the one found in the DB, which already passed the controls at the time of creation
    check("mail")
        .trim()
        .isEmail()
        .withMessage("Enter valid email address")
        // Email normalization (lowercase)
        .normalizeEmail({ gmail_remove_dots: false }),

    check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("You must fill in the password to be able to enter"),

    (req, res, next) => {
        const errors = validationResult(req);
        // If errors is NOT empty
        !errors.isEmpty()
            ? res.status(400).json({ errores: errors.array() })
            : next();
    },
];

const validatorResetPassword = [
    check("password_1")
        .trim()
        .isStrongPassword()
        .withMessage(
            "This password must be at least 8 characters and contain at least one uppercase letter, one lower case letter, one number and one special alphanumeric character"
        ),

    check("password_2").custom(async (password_2, { req }) => {
        if (req.body.password_1 !== password_2) {
            throw new Error("Both passwords must be identical");
        }
    }),

    (req, res, next) => {
        const token = req.params.token;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const arrWarnings = errors.array();
            res.render("formResetPass", { arrWarnings, token });
        } else {
            // Go to /user/reset-password/{{token}}
            return next();
        }
    },
];

module.exports = { validatorUser, validatorLoginUser, validatorResetPassword };
