const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const url = require("url");
const mBackend = require(corePath + "/middlewares/middlewareAdmin");
const adminMenuHtml = require(corePath + "/utility//adminMenuHtml");
const paginate = require(corePath + "/utility//adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility//adminCustomEvents");
const adminFormHelper = require(corePath + "/utility//adminFormHelper");
const { sliderImageForm } = require('../models/sliderImageForm.js');
var dateTime = require("node-datetime");

/*************************** Model *********************************/
let {
    sliderModel,
    sliderImageModel,
    sliderSchema,
    sliderImageSchema,
} = require("../models/sliderModel.js");

/********************************** Rendering to Slider QNA Listing ********************************************************************/

const getSliderOptionsListing = async (req, res, next) => {
    var sliderId = req.params.sliderId ? req.params.sliderId : 0;
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/sliderimages/list/" + sliderId + "/";
    var filter = { sliderId: sliderId };

    sliderImageModel.find(filter).skip(perPage * currentPage - perPage).limit(perPage)
        .exec(function (err, sliderOptionsCollection) {
            adminCustomEvents.emit("slider Options Loaded", sliderOptionsCollection);
            paginate.getPaginate(sliderImageModel, req, pageUrl, perPage, currentPage)
                .then((pagaintion) => {
                    if (err) return next(err);
                    res.render("slider/views/sliderimages/list_options", {
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Slider Options List",
                        collection: sliderOptionsCollection,
                        paginationHtml: pagaintion ?? '',
                        responce: sliderOptionsCollection,
                        data: data,
                        sliderId: sliderId
                    });
                });
        });
}


/********************************** Edit Slider action  ********************************************************************/

const editSliderOptions = async (req, res, next) => {
    var id = req.params.id ? req.params.id : 0;
    const dataArray = {};
    dataArray.formData = {};

    // Initialize ModifiedDate property inside formData
    dataArray.formData.modifiedDate = ""; // Assuming ModifiedDate is a string
    sliderImageModel.find({ id: id }, async function (err, response) {
        var postUrl = "/admin/sliderimages/update/" + id;
        var sliderOptionsResponse = response.pop();
        if (sliderOptionsResponse !== undefined) {
            dataArray.action = postUrl;
            // Assign categoryResponse to formData
            dataArray.formData = sliderOptionsResponse;
        }

        // Date Format for Modified
        var dt = dateTime.create();
        var formatted = dt.format("Y-m-d H:M:S");

        // Assign formatted date to ModifiedDate property
        dataArray.formData.modifiedDate = formatted;
        // Generate dynamic form HTML
        var sliderOptionsFormHtml = adminFormHelper.getFrom(sliderImageForm(dataArray));
        console.log(dataArray);
        res.render("slider/views/sliderimages/add_options", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            collection: sliderOptionsResponse,
            title: "Slider Edit",
            response: sliderOptionsResponse,
            schemaModel: sliderImageSchema,
            form: sliderOptionsFormHtml,
            id: id,
        });
    });
};


/********************************** Add Slider action  ********************************************************************/

const addSliderOptions = async (request, response, next) => {
    var sliderId = request.params.sliderId ? request.params.sliderId : 0;
    const dataArray = new Object();
    var postUrl = "/admin/sliderimages/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await sliderImageModel.countDocuments()) + 1;
    dataArray.formData.sliderId = sliderId;
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

    var sliderOptionsFormHtml = adminFormHelper.getFrom(sliderImageForm(dataArray));
    response.render("slider/views/sliderimages/add_options", {
        menuHtml: adminMenuHtml.getMenuHtml(),
        title: "Slider Question Answer Form",
        response: response,
        sliderId: sliderId,
        form: sliderOptionsFormHtml,
    });
}


/********************************** Update Slider action  ********************************************************************/

const updateSliderOptions = async (req, res, next) => {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.id = req.body.id;
    const sliderId = req.body.sliderId ? req.body.sliderId : 0;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, sliderImageForm(dataArray), next);
    // callback();
    const id = req.body.id;
    if (errors) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: "/admin/sliderimages/edit/" + id,
                response: req.body,
            })
        );
    } else {
        const sliderOptionsDataModel = new Object();
        const prefix = 'options';
        const options = [];

        Object.keys(req.body).forEach((key, index) => {
            if (key == '_id' || key == 'Submit') {
                return;
            }
            if (key.startsWith(prefix)) {
                options.push(req.body[key]);
                return;
            }
            sliderOptionsDataModel[key]
            sliderOptionsDataModel['options'] = options;
            sliderOptionsDataModel[key] = req.body[key];
        });
        sliderImageModel.findByIdAndUpdate(
            req.body._id,
            sliderOptionsDataModel,
            { upsert: true },
            function (err, num, n) {
                if (err) {
                    throw err;
                } else {
                    //console.log(newCategory);
                    req.flash("successMsg", "You successfully Update this category");
                    res.redirect(`/admin/sliderimages/list/${sliderId}/1`);
                }
            }
        );
    }
}


/********************************** Save Slider action  ********************************************************************/

const saveSliderOptions = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const id = req.body.id ? req.body.id : 0;
    const sliderId = req.body.sliderId ? req.body.sliderId : 0;
    dataArray.formData.id = id;
    dataArray.formData.sliderId = sliderId;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, sliderImageForm(dataArray), next);
    if (errors) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: `/admin/sliderimages/add/${sliderId}`,
                query: req.body,
            })
        );
    } else {
        const sliderOptionsDataModel = new Object();
        const prefix = 'options';
        const options = [];

        Object.keys(req.body).forEach((key, index) => {
            if (key == '_id' || key == 'Submit') {
                return;
            }
            if (key.startsWith(prefix)) {
                options.push(req.body[key]);
                return;
            }
            sliderOptionsDataModel[key]
            sliderOptionsDataModel['options'] = options;
            sliderOptionsDataModel[key] = req.body[key];
        });

        //console.log(sliderOptionsDataModel);return;

        let newSliderOptions = new sliderImageModel(sliderOptionsDataModel);
        newSliderOptions.save(function (err) {
            if (err) {
                if (err) return next(err);;
            } else {
                req.flash("successMsg", "You successfully save this slider qptions");
                res.redirect(`/admin/sliderimages/list/${sliderId}/1`);
            }
        });
    }
};

/********************************** Delete Slider action  ********************************************************************/

const deleteSliderOptions = async function (req, res) {
    var id = req.params._id ? req.params._id : 0;
    var objectSliderOptions = new Object();
    objectSliderOptions._id = id.trim();
    var sliderId = req.params.sliderId;
    sliderImageModel.findOneAndRemove(objectSliderOptions, function (err) {
        if (err) {
            adminCustomEvents.emit("sliderOptionsDeleteFailed", err);
            res.redirect(`/admin/sliderimages/list/${sliderId}/1`);
        } else {
            adminCustomEvents.emit("sliderOptionsDeleted", "Slider Options Has been Deleted");
            req.flash("successMsg", "You successfully deleted this Slider Options.");
            res.redirect(`/admin/sliderimages/list/${sliderId}/1`);
        }
    });

};



module.exports = { getSliderOptionsListing, editSliderOptions, addSliderOptions, updateSliderOptions, saveSliderOptions, deleteSliderOptions };
