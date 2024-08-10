const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const layoutBackendPath = app.locals.layoutBackendPath;
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const url = require("url");
const session = require("express-session");
const mBackend = require(corePath + "/middlewares/middlewareAdmin.js");
const config = require(corePath + "/utility/adminMenuConfig");
const html = require(corePath + "/utility/adminMenuHtml");
const paginate = require(corePath + "/utility/adminPaginationHelper");
const Response = require(corePath + "/utility/messageHelper");
const adminCustomEvents = require(corePath + "/utility/adminCustomEvents");
const dynamicForm = require(corePath + "/utility/adminFormHelper");

const { getValidate } = require(corePath + "/utility/validationHelper");
var dateTime = require("node-datetime");

const async = require("async");
const _mongodb = require(corePath + "/config/database.js");
/*************************** Model *********************************/
let { ordersModel } = require("../models/sales.order.js");



router.get(
  "/list/:page",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var filter = {};
    var pageUrl = "/admin/orders/list/";

    ordersModel.find(filter)
      .populate('customers', 'firstname lastname')
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, orderCollection) {
        adminCustomEvents.emit("Order List Loaded", orderCollection);
        console.log(orderCollection);
        paginate
          .getPaginate(
            ordersModel.find(filter),
            req,
            pageUrl,
            perPage,
            currentPage
          )
          .then((pagaintion) => {
            if (err) return next(err);
            res.render(modulesPath + "/sales/views/list", {
              menuHtml: html.getMenuHtml(),
              title: "Orders",
              collection: orderCollection,
              paginationHtml: pagaintion,
              orders: orderCollection,
              data: data,
            });
          });
      });
  }
);


router.get(
  "/details/:id",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    ordersModel.findById(req.params.id)
      .populate('customers', 'firstname lastname')
      .exec(function (err, orderCollection) {
        adminCustomEvents.emit("Order List Loaded", orderCollection);
        console.log(orderCollection);
        if (err) return next(err);
        res.render(modulesPath + "/sales/views/order_details", {
          menuHtml: html.getMenuHtml(),
          title: "Orders",
          collection: orderCollection,
          order: orderCollection,
          data: data,
        });
      });
  }
);



module.exports = router;
