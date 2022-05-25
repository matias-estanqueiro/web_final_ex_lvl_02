"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
});

productSchema.set("toJSON", {
    transform(doc, ret) {
        delete ret.__v;
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
