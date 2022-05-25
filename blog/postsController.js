"use strict";

const Post = require("./postsModel");

// show all blog posts
const listAllPosts = async (req, res, next) => {
    const result = await Post.find();
    !result.length ? next() : res.status(200).json(result);
};

// show post with word in title
const listPostWithWord = async (req, res, next) => {
    const result = await Post.find({ title: { $regex: req.params.word } });
    !result.length ? next() : res.status(200).json(result);
};

// add a new blog post
const newPost = async (req, res, next) => {
    try {
        const newPost = new Post({ ...req.body });
        const result = await newPost.save();
        res.status(201).json(result);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

// remove an existing blog post
const deletePost = async (req, res, next) => {
    const result = await Post.findByIdAndDelete(req.params.id);
    !result ? next() : res.status(200).json(result);
};

// modify existing blog post
const modifyPost = async (req, res, next) => {
    try {
        const result = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(result);
    } catch (error) {
        error.status = 400;
        next(error);
    }
};

module.exports = {
    listAllPosts,
    listPostWithWord,
    newPost,
    deletePost,
    modifyPost,
};
