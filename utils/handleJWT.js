"use strict";

const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;

// Token generation. Composed of header + paylod (information) + signature verification
// { time }: Function argument that contains the expiration time of the token
const tokenSign = async (user, time) => {
    const sign = jwt.sign(user, key, { expiresIn: time });
    return sign;
};

// Check validity and expiration of the token to see if it is still active
const tokenVerify = async (token) => {
    try {
        return jwt.verify(token, key);
    } catch (error) {
        return error;
    }
};

module.exports = {
    tokenSign,
    tokenVerify,
};
