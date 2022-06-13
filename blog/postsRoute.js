"use strict";

const router = require("express").Router();
const { validatorPost } = require("../validators/postValidator");
const isAuth = require("../utils/handleAuthorization");
const {
    listAllPosts,
    listSelectedPost,
    newPost,
    deletePost,
    modifyPost,
} = require("./postsController");

// show all posts from the blog
router.get("/", listAllPosts);

// show selected post
router.get("/post/:id", isAuth, listSelectedPost);

//add new post
router.post("/add-post", isAuth, validatorPost, newPost);

// delete existing post (owner function only)
router.delete("/delete/:id", isAuth, deletePost);

// modify existing post (owner function only)
router.post("/update/:id", isAuth, validatorPost, modifyPost);

module.exports = router;
