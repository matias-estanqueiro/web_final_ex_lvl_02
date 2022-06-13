"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    mail: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    comments: [
        {
            body: { type: String },
            date: { type: Date, default: Date.now() },
        },
    ],
});

postSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.__v;
    },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
