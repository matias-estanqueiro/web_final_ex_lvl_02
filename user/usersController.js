const User = require("./usersModel");
// BCRYPT: A library to help you hash passwords.
const { hashPassword, checkPassword } = require("../utils/handlePassword");
// JSONWEBTOKEN: An implementation of JSON Web Tokens.
const { tokenSign, tokenVerify } = require("../utils/handleJWT");
// NODEMAILER: Send emails from Node.js
const { transport } = require("../utils/handleMail");
// Extracts data validated or sanitized by express-validator from the request and builds an object with them
const { matchedData } = require("express-validator");
//
const mongoose = require("mongoose");
// The node:fs module enables interacting with the file system in a way modeled on standard POSIX functions.
const fs = require("fs");

//get all users of the database
const listAllUsers = async (req, res, next) => {
    const result = await User.find();
    !result.length ? next() : res.status(200).json(result);
};

// get a specific User
const listUserById = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    // I tried to use .findById() but it did not return the result of the query. That's why .find() was used
    const result = await User.find({ _id: req.params.id });
    !result.length ? next() : res.status(200).json(result[0]);
};

// login user
const loginUser = async (req, res, next) => {
    cleanReq = matchedData(req);
    const result = await User.find({ mail: req.body.mail });
    // If result returns empty, it means that the email is not registered in the database.
    if (!result.length) return next();
    // The encryption of the password entered by the user is compared with the password that was saved encrypted in the database
    if (await checkPassword(req.body.password, result[0].password)) {
        // Token Payload
        const userData = {
            id: result[0]._id,
            name: result[0].name,
            mail: result[0].mail,
        };
        // Token creation
        const tokenData = { token: await tokenSign(userData, "2h"), userData };
        res.status(200).json({
            message: `Welcome ${result[0].name}`,
            token_info: tokenData,
        });
    } else {
        let error = new Error();
        error.status = 401;
        error.message =
            "The username or password entered is not correct. Try again!";
        next(error);
    }
};

// register new user
const registerUser = async (req, res, next) => {
    cleanReq = matchedData(req);
    // Definition of the path of the file to be stored in the database
    let file = null;
    req.file
        ? (file = `${process.env.PUBLIC_URL}/${req.file.filename}`)
        : // Generic file (image) in case that the user dont upload it
          (file = `${process.env.PUBLIC_URL}/img-no-avatar.png`);
    // Encryption of the password entered by the user for storage in the database
    const password = await hashPassword(req.body.password);
    // Assigning password to the User record
    const newUser = new User({
        ...req.body,
        password,
        file,
    });
    try {
        result = await newUser.save();
        // Token payload
        const userData = {
            id: result._id,
            name: req.body.name,
            mail: req.body.mail,
        };
        // Token creation
        const tokenData = { token: await tokenSign(userData, "2h"), userData };
        res.status(201).json({
            message: `${result.name} Registered!`,
            token_info: tokenData,
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        error.status = 400;
        next(error);
    }
};

// delete existing user
const deleteUser = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await User.findByIdAndDelete(req.params.id);
    !result
        ? next()
        : res
              .status(200)
              .json({ message: `${result.name} removed successfully` });
};

// modify user information (profile)
const modifyUser = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    try {
        // when the user modifies his data, he cannot modify his password from the endpoint itself. A change password button will be added that will use the "reset password" logic (mail + link + token)
        const result = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(result);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// --------------------- PASSWORD RECOVERY CONTROLLERS ------------------- //

// user forgets his password
const retrievePassword = async (req, res, next) => {
    // loginUser() is not reused because in the function req.body.password is compared with the result of the DB, and in the req.body of retrieve-password the password itself is not found
    const result = await User.find({ mail: req.body.mail });
    if (!result.length) return next();
    // Token Payload
    const userData = {
        id: result[0]._id,
        name: result[0].name,
        mail: result[0].mail,
    };
    // Token creation
    const token = await tokenSign(userData, "10m");
    const link = `${process.env.PUBLIC_URL}/user/reset-password/${token}`;

    const mailPassword = {
        from: "user_support@drumat.com",
        to: userData.mail,
        subject: "[DRUMAT] Password recovery link",
        html: `
        <h2> Recovery Link </h2>
        <p>To reset password click on the link</p>
        <a href="${link}">click!</a>
        `,
    };
    transport.sendMail(mailPassword, (err, data, next) => {
        if (err) return next(err);
        res.status(200).json({
            message: `${userData.name}, an email with a password recovery link has been sent to ${userData.mail}. You have 10 minutes to reset your password`,
        });
    });
};

// We show the form so that the user can reset the password
const resetPassword = async (req, res, next) => {
    // token
    const token = req.params.token;
    // user data
    const tokenStatus = await tokenVerify(req.params.token);
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Invalid or Expired Token" });
    } else {
        res.render("formResetPass", { token, tokenStatus });
    }
};

// Receive the new password from the form to store it in the database
const saveNewPassword = async (req, res, next) => {
    const token = req.params.token;
    const tokenStatus = await tokenVerify(token);
    if (tokenStatus instanceof Error) {
        res.status(403).json({ message: "Expired Token" });
    } else {
        const password = await hashPassword(req.body.password_1);
        try {
            result = await User.findByIdAndUpdate(tokenStatus.id, password);
            console.log(result);
            res.status(200).json({
                message: `${tokenStatus.name}, your password has been successfully updated`,
            });
        } catch (error) {
            next(error);
        }
    }
};

// ----------------------------------------------------------------------- //

module.exports = {
    listAllUsers,
    listUserById,
    registerUser,
    deleteUser,
    modifyUser,
    loginUser,
    retrievePassword,
    resetPassword,
    saveNewPassword,
};
