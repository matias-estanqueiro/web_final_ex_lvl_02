"use strict";

const Post = require("./postsModel");
// Extracts data validated or sanitized by express-validator from the request and builds an object with them
const { matchedData } = require("express-validator");
// Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require("mongoose");

// show all blog posts
const listAllPosts = async (req, res, next) => {
    let result = null;
    if (req.query.title) {
        result = await Post.find({ title: { $regex: req.query.title } });
    } else {
        result = await Post.find();
    }
    !result.length ? next() : res.status(200).json(result);
};

// show especific blog post
const listSelectedPost = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await Post.find({ _id: req.params.id });
    if (!result.length) return next();
    res.status(200).json(result);
};

// add a new blog post
const newPost = async (req, res, next) => {
    const cleanReq = matchedData(req);
    const newPost = new Post({
        author: req.userInfo.mail,
        ...req.body,
    });
    try {
        const result = await newPost.save();
        res.status(201).json({
            message: `${req.userInfo.name} your post was published successfully!`,
            newPost,
        });
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// remove an existing blog post
const deletePost = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await Post.find({ _id: req.params.id });
    if (!result.length) return next();
    if (result[0].author === req.userInfo.mail) {
        const DeleteResult = await Post.findByIdAndDelete(result[0].id);
        res.status(200).json({ message: "The post was deleted correctly!" });
    } else {
        let error = new Error();
        error.status = 401;
        error.message = "You can only delete the posts you created!";
        next(error);
    }
};

// modify existing blog post
const modifyPost = async (req, res, next) => {
    // Verify that the id found in req.params is valid, otherwise a castError (BSONTypeError) is generated. For example, if the passed id is 23 characters long instead of 24
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    const result = await Post.find({ _id: req.params.id });
    if (!result.length) return next();
    if (result[0].author === req.userInfo.mail) {
        if (!req.body.title) req.body.title = result[0].title;
        if (!req.body.content) req.body.content = result[0].content;
        const modifyResult = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        res.status(200).json({
            message: "The post was modified correctly!",
            post: modifyResult,
        });
    } else {
        let error = new Error();
        error.status = 401;
        error.message = "You can only modify the posts you created!";
        next(error);
    }
};

module.exports = {
    listAllPosts,
    listSelectedPost,
    newPost,
    deletePost,
    modifyPost,
};
