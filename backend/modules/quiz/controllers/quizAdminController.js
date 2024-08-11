const express = require("express");
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const url = require("url");
const mBackend = require(corePath + "/middlewares/middlewareAdmin");
const adminMenuHtml = require(corePath + "/utility//adminMenuHtml");
const paginate = require(corePath + "/utility//adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility//adminCustomEvents");
const adminFormHelper = require(corePath + "/utility//adminFormHelper");
const { quizForm } = require("../models/quizForm.js");
const { quizQnaForm } = require('../models/quizQnaForm.js');
var dateTime = require("node-datetime");

/*************************** Model *********************************/
let {
    QuizModel,
    QuizQuestionAnswerModel,
    quizSchema,
    quizQuestionAnswerSchema,
} = require("../models/quizModel.js");

/********************************** Rendering to Quiz Listing ********************************************************************/

const getQuizListing = async (req, res, next) => {
    var id = req.params.id ? req.params.id : 0;
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/quiz/list/";
    QuizModel.find().skip(perPage * currentPage - perPage).limit(perPage)
        .exec(function (err, quizCollection) {
            adminCustomEvents.emit("quizLoaded", quizCollection);
            paginate.getPaginate(QuizModel, req, pageUrl, perPage, currentPage)
                .then((pagaintion) => {
                    if (err) return next(err);
                    res.render("quiz/views/quiz/list", {
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Quiz List",
                        collection: quizCollection,
                        paginationHtml: pagaintion,
                        responce: quizCollection,
                        data: data,
                        id: id
                    });
                });
        });
}


/********************************** Edit Quiz action  ********************************************************************/

const editQuiz = async (req, res, next) => {
    var Id = req.params.Id ? req.params.Id : 0;
    const dataArray = {};
    dataArray.formData = {};

    // Initialize ModifiedDate property inside formData
    dataArray.formData.modifiedDate = ""; // Assuming ModifiedDate is a string

    QuizModel.find({ Id: Id }, async function (err, response) {
        var postUrl = "/admin/quiz/update/" + Id;
        var quizResponse = response.pop();

        if (quizResponse !== undefined) {
            dataArray.action = postUrl;
            // Assign categoryResponse to formData
            dataArray.formData = quizResponse;
        }

        // Date Format for Modified
        var dt = dateTime.create();
        var formatted = dt.format("Y-m-d H:M:S");

        // Assign formatted date to ModifiedDate property
        dataArray.formData.modifiedDate = formatted;

        // Generate dynamic form HTML
        var quizFormHtml = adminFormHelper.getFrom(quizForm(dataArray));

        res.render("quiz/views/quiz/add", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            collection: quizResponse, // Use categoryResponse for collection
            title: "Quiz Edit",
            response: quizResponse,
            schemaModel: quizSchema,
            form: quizFormHtml,
            Id: Id,
        });
    });
};


/********************************** Add Quiz action  ********************************************************************/

const addQuiz = async (request, response, next) => {
    var id = request.params.id ? request.params.id : 0;
    const dataArray = new Object();
    var postUrl = "/admin/quiz/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await QuizModel.countDocuments()) + 1; // Int Id of Category
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

    var quizFormHtml = adminFormHelper.getFrom(quizForm(dataArray));
    var quizQuestionAnswerFormHtml = adminFormHelper.getFrom(quizQnaForm(dataArray));
    if (id==0) {
        response.render("quiz/views/quiz/add", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            title: "Quiz Form",
            response: response,
            form: quizFormHtml,
        });
    } else {
        response.render("quiz/views/quiz/add_qna", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            title: "Quiz Question Answer Form",
            response: response,
            form: quizQuestionAnswerFormHtml,
        });
    }
}


/********************************** Update Quiz action  ********************************************************************/

const updateQuiz = async (req, res, next) => {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.Id = req.body.Id;
    dataArray.formData.parentId = req.body.parentId;

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, quizForm(dataArray), next);

    // callback();
    const Id = req.body.Id;
    var quizImage = "";

    // Start Image and Validation
    if (req.file == undefined) {
        quizImage = req.body.quizImage;
    } else {
        quizImage = req.file.filename;
    }

    if (errors || !quizImage) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: "/admin/quiz/edit/" + Id,
                response: req.body,
            })
        );
    } else {
        var objectCat = new Object();
        objectCat = req.body;
        // objectCat.code = req.body.code;
        // objectCat.name = req.body.name;
        // objectCat.parentId = req.body.parentId;
        // objectCat.active = req.body.active;
        // objectCat.CreatedDate = req.body.createdDate;
        // objectCat.ModifiedDate = req.body.modifiedDate || "";
        // objectCat.externalId = req.body.externalId;
        // objectCat.storeId = req.body.storeId;
        // objectCat.updateRequired = req.body.updateRequired;
        // objectCat.quizImage = quizImage;
        // const parentId = req.body.parentId;
        ///console.log(objectCat);return;
        QuizModel.findByIdAndUpdate(
            req.body._id,
            objectCat,
            { upsert: true },
            function (err, num, n) {
                if (err) {
                    throw err;
                } else {
                    //console.log(newCategory);
                    req.flash("successMsg", "You successfully Update this category");
                    res.redirect("/admin/category/list/1");
                }
            }
        );
    }
}


/********************************** Save Quiz action  ********************************************************************/

const saveQuiz = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const id = req.body.id ? req.body.id : 0;
    dataArray.formData.id = id;
    mBackend.isAuthorized;

    errors = mBackend.isFormValidated(req, res, quizForm(dataArray), next);

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
                pathname: "/admin/quiz/add/",
                query: req.body,
            })
        );
    } else {
        const quizImage = req.file.filename;
        const quizDataModel = new Object();
        Object.keys(req.body).forEach((key, index) => {
            if (key == '_id' || key == 'Submit') {
                return;
            }
            quizDataModel[key] = req.body[key];
        });
        quizDataModel['quizImage'] = quizImage;

        let newQuiz = new QuizModel(quizDataModel);
        newQuiz.save(function (err) {
            if (err) {
                return;
            } else {
                req.flash("successMsg", "You successfully save this quiz");
                res.redirect("/admin/quiz/list/1");
            }
        });
    }
};

/********************************** Delete Quiz action  ********************************************************************/

const deleteQuiz = async function (req, res) {
    var id = req.query.id ? req.query.id : 0;
    var parentId = req.query.parentId ? req.query.parentId : 0;
    var objectCat = new Object();
    objectCat._id = id.trim();

    QuizModel.countDocuments({ parentCategory: id.trim() }).then((count) => {
        adminCustomEvents.emit(
            "quizDeleteBefore",
            "Count of child quiz questions" + count
        );
        if (count === 0) {
            QuizModel.findOneAndRemove(objectQuiz, function (err) {
                if (err) {
                    adminCustomEvents.emit("quizDeleteFailed", err);
                    res.redirect("/admin/quiz/list?id=" + parent_id);
                } else {
                    adminCustomEvents.emit("quizDeleted", "Quiz Has been Deleted");
                    req.flash("successMsg", "You successfully deleted this Quiz.");
                    res.redirect("/admin/quiz/list?id=" + parentId);
                }
            });
        } else {
            let errors = [];
            errors.push({ msg: "Please delete child quiz first." });
            adminCustomEvents.emit("quizDeleteFailed", errors);
            req.flash("errorMsg", errors);
            res.redirect("/admin/quiz/list?id=" + parentId);
        }
    });
};



module.exports = { getQuizListing, editQuiz, addQuiz, updateQuiz, saveQuiz, deleteQuiz };
