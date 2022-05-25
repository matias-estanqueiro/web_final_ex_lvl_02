"use strict";

const User = require("./usersModel");
const { hashPassword, checkPassword } = require("../utils/handlePassword");

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
    if (!result.length) next();
    // The encryption of the password entered by the user is compared with the password that was saved encrypted in the database
    if (await checkPassword(req.body.password, result[0].password)) {
        res.status(200).json({ message: `Welcome ${result[0].name}` });
    } else {
        let error = new Error();
        error.status = 401;
        error.message = "Unauthorized";
        next(error);
    }
};

// register new user
const registerUser = async (req, res, next) => {
    // Definition of the path of the file to be stored in the database
    let file = null;
    req.body.file
        ? (file = `${process.env.PUBLIC_URL}/${req.file.filename}`)
        : (file = `${process.env.PUBLIC_URL}/img-no-avatar.jpg`);
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
        res.status(201).json(result);
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

//modify user information (profile)
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

module.exports = {
    listAllUsers,
    listUserById,
    registerUser,
    deleteUser,
    modifyUser,
    loginUser,
};
