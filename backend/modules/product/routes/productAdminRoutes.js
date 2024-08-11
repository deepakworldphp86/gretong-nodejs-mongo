// productRoutes.js
const multer = require("multer");

const express = require("express");
const app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const productAdminController = require("../controllers/productAdminController.js");
const middlewareAdmin = require(corePath + "/middlewares/middlewareAdmin.js");
const { upload } = require('../helpers/productHelper.js'); 

router.get("/list/:page", middlewareAdmin.isAuthorized, productAdminController.getProductList);

router.get("/edit/:id", middlewareAdmin.isAuthorized, productAdminController.editProduct);

router.get("/add", middlewareAdmin.isAuthorized, productAdminController.addProduct);

router.post("/update/:id", upload.single("productGalleryImage"), productAdminController.updateProduct);

router.post("/save", upload.single("productGalleryImage"), productAdminController.saveProduct);

router.get("/delete/:_id", productAdminController.deleteProduct);

module.exports = router;
