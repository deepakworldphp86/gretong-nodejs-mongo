const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const router = express.Router();
const mBackend = require(corePath + "/middlewares/middlewareAdmin.js");
const ordersAdminController = require('../controllers/ordersAdminController.js');


//Order Routes 

router.get("/list/:page",mBackend.isAuthorized,ordersAdminController.getOrders);
router.get("/details/:id",mBackend.isAuthorized,ordersAdminController.getOrderDetails);

module.exports = router;
