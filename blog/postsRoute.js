"use strict";

const router = require("express").Router();
const { validatorPost } = require("../validators/postValidator");
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
router.get("/:word", listPostWithWord);

//add new post
router.post("/add-post", validatorPost, newPost);

// delete existing post (owner function only)
router.delete("/delete/:id", deletePost);

// modify existing post (owner function only)
router.post("/update/:id", validatorPost, modifyPost);

module.exports = router;
