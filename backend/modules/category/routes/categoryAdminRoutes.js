const express = require("express");
var app = require('../../../appConfig.js');
var categoryAdminController = require('../controllers/categoryAdminController.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath + "/middlewares/middlewareAdmin.js");
const categoryHelper = require('../helpers/categoryHelper.js')

//Category Admin Routes
router.get("/list/:id/:page", mBackend.isAuthorized, categoryAdminController.getCategoriesList);
router.get("/edit/:id", mBackend.isAuthorized, categoryAdminController.editCategory);
router.get("/add/:parentId", mBackend.isAuthorized, categoryAdminController.addCategory);
router.post("/update/:id", categoryHelper.upload.single("categoryImage"), categoryAdminController.updateCategory);
router.post("/save",categoryHelper.upload.single("categoryImage"), categoryAdminController.saveCategory);
router.get("/delete/:id/:parentId",categoryAdminController.deleteCategory);


module.exports = router;
