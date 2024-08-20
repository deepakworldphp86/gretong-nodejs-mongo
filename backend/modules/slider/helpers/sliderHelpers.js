const multer = require("multer");
const path = require("path"); // Import path module
var app = require('../../../appConfig.js');
const publicPath = app.locals.publicPath;

/************************** Upload Config *************************/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(publicPath, "/admin/uploads/slider_image/")); // Use path.join for cross-platform compatibility
    },
    filename: function (req, file, cb) {
        // Extract the file extension
        const ext = path.extname(file.originalname);
        // Construct the filename with original extension
        cb(null, file.fieldname + "-" + Date.now() + ext);
    },
});

var upload = multer({ storage: storage });

module.exports = { upload };
