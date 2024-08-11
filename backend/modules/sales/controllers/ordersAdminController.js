const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const adminMenuHtml = require(corePath + "/utility/adminMenuHtml");
const paginate = require(corePath + "/utility/adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility/adminCustomEvents");
/*************************** Model *********************************/
let { ordersModel } = require("../models/orderModel.js");



const getOrders = async (req, res, next) => {
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
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Orders",
                        collection: orderCollection,
                        paginationHtml: pagaintion,
                        orders: orderCollection,
                        data: data,
                    });
                });
        });
}



const getOrderDetails = async (req, res, next) => {
    var data = [];
    ordersModel.findById(req.params.id)
        .populate('customers', 'firstname lastname')
        .exec(function (err, orderCollection) {
            adminCustomEvents.emit("Order List Loaded", orderCollection);
            console.log(orderCollection);
            if (err) return next(err);
            res.render(modulesPath + "/sales/views/order_details", {
                menuHtml: adminMenuHtml.getMenuHtml(),
                title: "Orders",
                collection: orderCollection,
                order: orderCollection,
                data: data,
            });
        });
}




module.exports = { getOrders, getOrderDetails };
