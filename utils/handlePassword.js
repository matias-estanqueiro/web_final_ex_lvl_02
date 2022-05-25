"use strict";

// bcrypt: a library to help you hash passwords.
const bcrypt = require("bcrypt");
// Rounds to generate salt
const saltRounds = 10;

// To has a password (auto-gen a salt and hash)
const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

// To check a password
const checkPassword = async (originalPass, hashPass) => {
    const passwordMatch = await bcrypt.compare(originalPass, hashPass);
    return passwordMatch;
};

module.exports = {
    hashPassword,
    checkPassword,
};
