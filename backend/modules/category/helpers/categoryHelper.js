const multer = require("multer");
var app = require('../../../appConfig.js');
const publicPath = app.locals.publicPath;

/************************** Upload Config *************************/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, publicPath + "/admin/uploads/category_image/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    },
});
var upload = multer({ storage: storage });

module.exports = {upload};