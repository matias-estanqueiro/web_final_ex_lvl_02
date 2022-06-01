"use strict";

const multer = require("multer");

// Definition of the place where we are going to save all the files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // __dirname (node): returns the path of the folder where the current JavaScript file resides
        const pathStorage = `${__dirname}/../public`;
        callback(null, pathStorage);
    },
    // Definition of the name of the files that are uploaded
    filename: (req, file, callback) => {
        // Get the file extension so can use it in the defined name
        const ext = file.originalname.split(".").pop();
        // Use Date.now() to generate non-repeating filenames and avoid conflicts
        const filename = `img-${Date.now()}.${ext}`;
        callback(null, filename);
    },
});

const fileUpload = multer({ storage });

module.exports = fileUpload;
