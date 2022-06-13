// There is no validation of existence because in the schema the values ​​are declared as required

const { check, validationResult } = require("express-validator");

const validatorPost = [
    check("title")
        .trim()
        .isLength({ min: 15, max: 60 })
        .withMessage("Character count: min 15; max 60"),

    check("content")
        .trim()
        // Approximately 30-500 words
        .isLength({ min: 140, max: 3000 })
        .withMessage("Character count: min 140; max 3000"),

    (req, res, next) => {
        const errors = validationResult(req);
        //if errors NOT empty
        !errors.isEmpty()
            ? res.status(400).json({ errores: errors.array() })
            : next();
    },
];

module.exports = { validatorPost };
