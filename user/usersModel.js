"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    birthday: { type: Date, required: true },
    file: { type: String },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, default: "not registered" },
    admin: { type: String, required: true, default: "false" },
});

userSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.__v;
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
