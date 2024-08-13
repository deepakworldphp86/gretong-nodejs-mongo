const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const url = require("url");
const mBackend = require(corePath + "/middlewares/middlewareAdmin");
const adminMenuHtml = require(corePath + "/utility//adminMenuHtml");
const paginate = require(corePath + "/utility//adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility//adminCustomEvents");
const adminFormHelper = require(corePath + "/utility//adminFormHelper");
const { quizOptionsForm } = require('../models/quizOptionsForm.js');
var dateTime = require("node-datetime");

/*************************** Model *********************************/
let {
    quizModel,
    quizOptionsModel,
    quizSchema,
    quizOptionsSchema,
} = require("../models/quizModel.js");

/********************************** Rendering to Quiz QNA Listing ********************************************************************/

const getQuizOptionsListing = async (req, res, next) => {
    var quizId = req.params.quizId ? req.params.quizId : 0;
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/quizoptions/list/" + quizId + "/";
    var filter = { quizId: quizId };

    quizOptionsModel.find(filter).skip(perPage * currentPage - perPage).limit(perPage)
        .exec(function (err, quizOptionsCollection) {
            adminCustomEvents.emit("quiz Options Loaded", quizOptionsCollection);
            paginate.getPaginate(quizOptionsModel, req, pageUrl, perPage, currentPage)
                .then((pagaintion) => {
                    if (err) return next(err);
                    res.render("quiz/views/quizoptions/list_options", {
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Quiz Options List",
                        collection: quizOptionsCollection,
                        paginationHtml: pagaintion ?? '',
                        responce: quizOptionsCollection,
                        data: data,
                        quizId: quizId
                    });
                });
        });
}


/********************************** Edit Quiz action  ********************************************************************/

const editQuizOptions = async (req, res, next) => {
    var id = req.params.id ? req.params.id : 0;
    const dataArray = {};
    dataArray.formData = {};

    // Initialize ModifiedDate property inside formData
    dataArray.formData.modifiedDate = ""; // Assuming ModifiedDate is a string
    quizOptionsModel.find({ id: id }, async function (err, response) {
        var postUrl = "/admin/quizoptions/update/" + id;
        var quizOptionsResponse = response.pop();
        if (quizOptionsResponse !== undefined) {
            dataArray.action = postUrl;
            // Assign categoryResponse to formData
            dataArray.formData = quizOptionsResponse;
        }

        // Date Format for Modified
        var dt = dateTime.create();
        var formatted = dt.format("Y-m-d H:M:S");

        // Assign formatted date to ModifiedDate property
        dataArray.formData.modifiedDate = formatted;
        // Generate dynamic form HTML
        var quizOptionsFormHtml = adminFormHelper.getFrom(quizOptionsForm(dataArray));
        console.log(dataArray);
        res.render("quiz/views/quizoptions/add_options", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            collection: quizOptionsResponse,
            title: "Quiz Edit",
            response: quizOptionsResponse,
            schemaModel: quizOptionsSchema,
            form: quizOptionsFormHtml,
            id: id,
        });
    });
};


/********************************** Add Quiz action  ********************************************************************/

const addQuizOptions = async (request, response, next) => {
    var quizId = request.params.quizId ? request.params.quizId : 0;
    const dataArray = new Object();
    var postUrl = "/admin/quizoptions/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await quizOptionsModel.countDocuments()) + 1;
    dataArray.formData.quizId = quizId;
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

    var quizOptionsFormHtml = adminFormHelper.getFrom(quizOptionsForm(dataArray));
    response.render("quiz/views/quizoptions/add_options", {
        menuHtml: adminMenuHtml.getMenuHtml(),
        title: "Quiz Question Answer Form",
        response: response,
        quizId: quizId,
        form: quizOptionsFormHtml,
    });
}


/********************************** Update Quiz action  ********************************************************************/

const updateQuizOptions = async (req, res, next) => {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.id = req.body.id;
    const quizId = req.body.quizId ? req.body.quizId : 0;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, quizOptionsForm(dataArray), next);
    // callback();
    const id = req.body.id;
    if (errors) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: "/admin/quizoptions/edit/" + id,
                response: req.body,
            })
        );
    } else {
        const quizOptionsDataModel = new Object();
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
            quizOptionsDataModel[key]
            quizOptionsDataModel['options'] = options;
            quizOptionsDataModel[key] = req.body[key];
        });
        quizOptionsModel.findByIdAndUpdate(
            req.body._id,
            quizOptionsDataModel,
            { upsert: true },
            function (err, num, n) {
                if (err) {
                    throw err;
                } else {
                    //console.log(newCategory);
                    req.flash("successMsg", "You successfully Update this category");
                    res.redirect(`/admin/quizoptions/list/${quizId}/1`);
                }
            }
        );
    }
}


/********************************** Save Quiz action  ********************************************************************/

const saveQuizOptions = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const id = req.body.id ? req.body.id : 0;
    const quizId = req.body.quizId ? req.body.quizId : 0;
    dataArray.formData.id = id;
    dataArray.formData.quizId = quizId;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, quizOptionsForm(dataArray), next);
    if (errors) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: `/admin/quizoptions/add/${quizId}`,
                query: req.body,
            })
        );
    } else {
        const quizOptionsDataModel = new Object();
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
            quizOptionsDataModel[key]
            quizOptionsDataModel['options'] = options;
            quizOptionsDataModel[key] = req.body[key];
        });

        //console.log(quizOptionsDataModel);return;

        let newQuizOptions = new quizOptionsModel(quizOptionsDataModel);
        newQuizOptions.save(function (err) {
            if (err) {
                if (err) return next(err);;
            } else {
                req.flash("successMsg", "You successfully save this quiz qptions");
                res.redirect(`/admin/quizoptions/list/${quizId}/1`);
            }
        });
    }
};

/********************************** Delete Quiz action  ********************************************************************/

const deleteQuizOptions = async function (req, res) {
    var id = req.params._id ? req.params._id : 0;
    var objectQuizOptions = new Object();
    objectQuizOptions._id = id.trim();
    var quizId = req.params.quizId;
    quizOptionsModel.findOneAndRemove(objectQuizOptions, function (err) {
        if (err) {
            adminCustomEvents.emit("quizOptionsDeleteFailed", err);
            res.redirect(`/admin/quizoptions/list/${quizId}/1`);
        } else {
            adminCustomEvents.emit("quizOptionsDeleted", "Quiz Options Has been Deleted");
            req.flash("successMsg", "You successfully deleted this Quiz Options.");
            res.redirect(`/admin/quizoptions/list/${quizId}/1`);
        }
    });

};



module.exports = { getQuizOptionsListing, editQuizOptions, addQuizOptions, updateQuizOptions, saveQuizOptions, deleteQuizOptions };
