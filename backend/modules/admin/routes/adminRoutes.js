// Required modules and configurations
const express = require("express");
const app = require("../../../appConfig.js");
const corePath = app.locals.corePath;

const router = express.Router();
const adminController = require('../controllers/adminController');
const middlewareAdmin = require(corePath+'/middlewares/middlewareAdmin');

// Routes
router.get('/login', adminController.getLoginView);
router.post('/login/post', adminController.postLoginData);
router.get('/', middlewareAdmin.isAuthorized, adminController.getDashboard);
router.get('/logout/', adminController.getLogout);

module.exports = router;
