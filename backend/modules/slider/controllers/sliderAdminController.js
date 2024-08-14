const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const url = require("url");
const mBackend = require(corePath + "/middlewares/middlewareAdmin");
const adminMenuHtml = require(corePath + "/utility//adminMenuHtml");
const paginate = require(corePath + "/utility//adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility//adminCustomEvents");
const adminFormHelper = require(corePath + "/utility//adminFormHelper");
const { sliderForm } = require("../models/sliderForm.js");
var dateTime = require("node-datetime");

/*************************** Model *********************************/
let {
    sliderModel,
    sliderImageModel,
    sliderSchema,
    sliderImageSchema,
} = require("../models/sliderModel.js");
const { Console } = require("console");

/********************************** Rendering to Slider Listing ********************************************************************/

const getSliderListing = async (req, res, next) => {
    var id = req.params.id ? req.params.id : 0;
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/slider/list/";
    sliderModel.find({}).skip(perPage * currentPage - perPage).limit(perPage)
        .exec(function (err, sliderCollection) {
            adminCustomEvents.emit("sliderLoaded", sliderCollection);
            paginate.getPaginate(sliderModel, req, pageUrl, perPage, currentPage)
                .then((pagaintion) => {
                    if (err) return next(err);
                    res.render("slider/views/slider/list", {
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Slider List",
                        collection: sliderCollection,
                        paginationHtml: pagaintion ?? '',
                        responce: sliderCollection,
                        data: data,
                        id: id
                    });
                });
        });
}


/********************************** Edit Slider action  ********************************************************************/

const editSlider = async (req, res, next) => {
    const id = req.params.id ? req.params.id.trim() : null;
    if (!id) {
        return res.status(400).send("Invalid ID provided.");
    }
    const dataArray = {};
    dataArray.formData = {};
    dataArray.formData.modifiedDate = "";
    sliderModel.findById(id)
        .exec()
        .then(sliderResponse => {
            var postUrl = "/admin/slider/update/" + id;

            if (sliderResponse !== undefined) {
                dataArray.action = postUrl;
                // Assign categoryResponse to formData
                dataArray.formData = sliderResponse;
            }

            // Date Format for Modified
            var dt = dateTime.create();
            var formatted = dt.format("Y-m-d H:M:S");

            // Assign formatted date to ModifiedDate property
            dataArray.formData.modifiedDate = formatted;

            // Generate dynamic form HTML
            var sliderFormHtml = adminFormHelper.getFrom(sliderForm(dataArray));

            res.render("slider/views/slider/add", {
                menuHtml: adminMenuHtml.getMenuHtml(),
                collection: sliderResponse, // Use categoryResponse for collection
                title: "Slider Edit",
                response: sliderResponse,
                schemaModel: sliderSchema,
                form: sliderFormHtml,
                id: id,
            });
        });
};


/********************************** Add Slider action  ********************************************************************/

const addSlider = async (request, response, next) => {
    var id = request.params.id ? request.params.id : 0;
    const dataArray = new Object();
    var postUrl = "/admin/slider/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.sliderId = (await sliderModel.countDocuments()) + 1; // Int Id of Category
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

    var sliderFormHtml = adminFormHelper.getFrom(sliderForm(dataArray));
    response.render("slider/views/slider/add", {
        menuHtml: adminMenuHtml.getMenuHtml(),
        title: "Slider Form",
        response: response,
        form: sliderFormHtml,
    });

}


/********************************** Update Slider action  ********************************************************************/

const updateSlider = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.id = req.body.id;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, sliderForm(dataArray), next);

    // callback();
    const _id = req.body._id;

    var sliderImage = "";

    // Start Image and Validation
    if (req.file == undefined) {
        sliderImage = req.body.sliderImage;
    } else {
        sliderImage = req.file.filename;
    }

    if (errors || !sliderImage) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: "/admin/slider/edit/" + _id,
                response: req.body,
            })
        );
    } else {
        var objectSlider = new Object();
        objectSlider = req.body;
        objectSlider.sliderImage = sliderImage;
        objectSlider.code = req.body.code;
        sliderModel.findByIdAndUpdate(
            req.body._id,
            objectSlider,
            { upsert: true },
            function (err, num, n) {
                if (err) {
                  return next(err);
                } else {
                    //console.log(newCategory);
                    req.flash("successMsg", "You successfully Update this slider");
                    res.redirect("/admin/slider/list/1");
                }
            }
        );
    }
}


/********************************** Save Slider action  ********************************************************************/

const saveSlider = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const id = req.body.id ? req.body.id : 0;
    dataArray.formData.id = id;
    mBackend.isAuthorized;

    errors = mBackend.isFormValidated(req, res, sliderForm(dataArray), next);
    if (!req.file && !errors) {
        errors = [];
        errors.push({ msg: "Image is required filed" });
    } else if (!req.file) {
        errors.push({ msg: "Image is required filed" });
    }
    if (errors || !req.file.filename) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: "/admin/slider/add/",
                query: req.body,
            })
        );
    } else {
        const sliderImage = req.file.filename;
        const sliderDataModel = new Object();
        Object.keys(req.body).forEach((key, index) => {
            if (key == '_id' || key == 'Submit') {
                return;
            }
            sliderDataModel[key] = req.body[key];
        });
        sliderDataModel['sliderImage'] = sliderImage;
        let newSlider = new sliderModel(sliderDataModel);
        newSlider.save(function (err) {
            if (err) {
                return next(err);
            } else {
                req.flash("successMsg", "You successfully save this slider");
                res.redirect("/admin/slider/list/1");
            }
        });
    }
};

/********************************** Delete Slider action  ********************************************************************/

const deleteSlider = async function (req, res) {
    var id = req.params._id ? req.params._id : 0;
    var sliderId = req.params.sliderId ? req.params.sliderId : 0;
    var objectSlider = new Object();
    objectSlider._id = id.trim();
    sliderImageModel.countDocuments({ sliderId: sliderId }).then((count) => {
        adminCustomEvents.emit(
            "sliderDeleteBefore",
            "Count of child slider questions" + count
        );
       
        if (count === 0) {
            sliderModel.findOneAndRemove(objectSlider, function (err) {
                if (err) {
                    adminCustomEvents.emit("sliderDeleteFailed", err);
                    res.redirect("/admin/slider/list/1");
                } else {
                    adminCustomEvents.emit("sliderDeleted", "Slider Has been Deleted");
                    req.flash("successMsg", "You successfully deleted this Slider.");
                    res.redirect("/admin/slider/list/1");
                }
            });
        } else {
            let errors = [];
            errors.push({ msg: "Please delete child slider options first." });
            adminCustomEvents.emit("sliderDeleteFailed", errors);
            req.flash("errorMsg", errors);
            res.redirect("/admin/slider/list/1");
        }
    });
};



module.exports = { getSliderListing, editSlider, addSlider, updateSlider, saveSlider, deleteSlider };
