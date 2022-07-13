"use strict";

const router = require("express").Router();
const isAuth = require("../utils/handleAuthorization");
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
    retrievePassword,
    resetPassword,
    saveNewPassword,
} = require("./usersController");

// ------------------------------------------------------------- //

// get all users from the database
router.get("/", isAuth, listAllUsers);

// get specific user
router.get("/view/:id", isAuth, listUserById);

// login user
router.post("/login", validatorLoginUser, loginUser);

// register new user
router.post(
    "/register",
    fileUpload.single("file"),
    validatorUser,
    registerUser
);

// delete existing user (owner & admin function)
router.delete("/remove/:id", isAuth, deleteUser);

// modify user information (profile)
router.post("/modify/:id", isAuth, modifyUser);

// --------------------- PASSWORD RECOVERY ROUTES ------------------- //

// form for the user to enter their email and thus be able to recover their password
router.post("/retrieve-password", retrievePassword);

// link and password recovery form for the user to reset their password
router.get("/reset-password/:token", resetPassword);

// we get the new password
router.post("/reset-password/:token", validatorResetPassword, saveNewPassword);

// ------------------------------------------------------------------ //

module.exports = router;
