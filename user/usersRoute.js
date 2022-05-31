"use strict";

const router = require("express").Router();
const {
    validatorUser,
    validatorLoginUser,
    validatorResetPassword,
} = require("../validators/userValidator");
const fileUpload = require("../utils/handleStorage");
const {
    loginUser,
    registerUser,
    deleteUser,
    modifyUser,
    listAllUsers,
    listUserById,
    retrievePass,
    resetPassword,
    saveNewPassword,
    retrievePassword,
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
router.get("/view/:id", listUserById);

// delete existing user
router.delete("/remove/:id", deleteUser);

// modify user information (profile)
router.post("/modify/:id", validatorUser, modifyUser);

// get all users from the database
router.get("/", listAllUsers);

// --------------------- PASSWORD RECOVERY ROUTES ------------------- //

// form for the user to enter their email and thus be able to recover their password
router.post("/retrieve-password", retrievePassword);

// link and password recovery form for the user to reset their password
router.get("/reset-password/:token", resetPassword);

// we get the new password
router.post("/reset-password/:token", validatorLoginUser, saveNewPassword);

// ------------------------------------------------------------------ //

module.exports = router;
