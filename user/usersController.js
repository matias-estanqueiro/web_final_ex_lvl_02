const User = require("./usersModel");
// BCRYPT: A library to help you hash passwords.
const { hashPassword, checkPassword } = require("../utils/handlePassword");
// JSONWEBTOKEN: An implementation of JSON Web Tokens.
const { tokenSign } = require("../utils/handleJWT");
// NODEMAILER: Send emails from Node.js
const { transport } = require("../utils/handleMail");
// Extracts data validated or sanitized by express-validator from the request and builds an object with them
const { matchedData } = require("express-validator");

//get all users of the database
const listAllUsers = async (req, res, next) => {
    const result = await User.find();
    !result.length ? next() : res.status(200).json(result);
};

// get a specific User
const listUserById = async (req, res, next) => {
    // I tried to use .findById() but it did not return the result of the query. That's why .find() was used
    const result = await User.find({ _id: req.params.id });
    !result.length ? next() : res.status(200).json(result);
};

// login user
const loginUser = async (req, res, next) => {
    const result = await User.find({ mail: req.body.mail });
    // If result returns empty, it means that the email is not registered in the database.
    if (!result.length) return next();
    // The encryption of the password entered by the user is compared with the password that was saved encrypted in the database
    if (await checkPassword(req.body.password, result[0].password)) {
        // Token Payload
        const userData = {
            name: result[0].name,
            surname: result[0].surname,
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
        error.message = "Unauthorized";
        next(error);
    }
};

// register new user
const registerUser = async (req, res, next) => {
    cleanBody = matchedData(req);
    // Definition of the path of the file to be stored in the database
    let file = null;
    req.body.file
        ? (file = `${process.env.PUBLIC_URL}/${req.file.filename}`)
        : // Generic file (image) in case that the user dont upload it
          (file = `${process.env.PUBLIC_URL}/img-no-avatar.jpg`);
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
            name: req.body.name,
            surname: req.body.surname,
            mail: req.body.mail,
        };
        // Token creation
        const tokenData = { token: await tokenSign(userData, "2h"), userData };
        res.status(201).json({
            message: `${result.name} Registered!`,
            token_info: tokenData,
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// delete existing user
const deleteUser = async (req, res, next) => {
    const result = await User.findByIdAndDelete(req.params.id);
    !result ? next() : res.status(200).json(result);
};

// modify user information (profile)
const modifyUser = async (req, res, next) => {
    try {
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
        name: result[0].name,
        surname: result[0].surname,
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
        <h2> Recovery Password </h2>
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

const resetPassword = async (req, res, next) => {
    res.render("formResetPass");
};

const saveNewPassword = async (req, res, next) => {};

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
