"use strict";

const router = require("express").Router();
const {
    validatorUser,
    validatorLoginUser,
} = require("../validators/userValidator");
const fileUpload = require("../utils/handleStorage");
const {
    loginUser,
    registerUser,
    deleteUser,
    modifyUser,
    listAllUsers,
    listUserById,
} = require("./usersController");

// ------------------------------------------------------------- //

// login user
router.get("/login", validatorLoginUser, loginUser);

// register new user
router.post(
    "/register",
    fileUpload.single("file"),
    validatorUser,
    registerUser
);

// get specific user
router.get("/view-user/:id", listUserById);

// delete existing user
router.delete("/remove/:id", deleteUser);

// modify user information (profile)
router.post("/modify/:id", validatorUser, modifyUser);

// get all users from the database
router.get("/", listAllUsers);

module.exports = router;
