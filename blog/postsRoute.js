"use strict";

const router = require("express").Router();
const { validatorPost } = require("../validators/postValidator");
const isAuth = require("../utils/handleAuthorization");
const {
    listAllPosts,
    listPostWithWord,
    newPost,
    deletePost,
    modifyPost,
} = require("./postsController");

// get all posts from the blog
router.get("/", listAllPosts);

// get posts with "word"
router.get("/find/:word", listPostWithWord);

//add new post
router.post("/add-post", isAuth, validatorPost, newPost);

// delete existing post (owner function only)
router.delete("/delete/:id", deletePost);

// modify existing post (owner function only)
router.post("/update/:id", validatorPost, modifyPost);

module.exports = router;
