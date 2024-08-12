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

/********************************** Rendering to Quiz QNA Listing ********************************************************************/

const getQuizQuestionListing = async (req, res, next) => {
    var quizId = req.params.quizId ? req.params.quizId : 0;
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/quizqna/list/" + quizId + "/";
    QuizQuestionAnswerModel.find({ quizId: quizId }).skip(perPage * currentPage - perPage).limit(perPage)
        .exec(function (err, quizqnaCollection) {
            adminCustomEvents.emit("quizQNALoaded", quizqnaCollection);
            paginate.getPaginate(QuizQuestionAnswerModel, req, pageUrl, perPage, currentPage)
                .then((pagaintion) => {
                    if (err) return next(err);
                    res.render("quiz/views/quizqna/list_qna", {
                        menuHtml: adminMenuHtml.getMenuHtml(),
                        title: "Quiz QNA List",
                        collection: quizqnaCollection,
                        paginationHtml: pagaintion,
                        responce: quizqnaCollection,
                        data: data,
                        quizId: quizId
                    });
                });
        });
}


/********************************** Edit Quiz action  ********************************************************************/

const editQuizQuestion = async (req, res, next) => {
    var id = req.params.id ? req.params.id : 0;
    const dataArray = {};
    dataArray.formData = {};

    // Initialize ModifiedDate property inside formData
    dataArray.formData.modifiedDate = ""; // Assuming ModifiedDate is a string
    QuizQuestionAnswerModel.find({ id: id }, async function (err, response) {
        var postUrl = "/admin/quizqna/update/" + id;
        var quizQnaResponse = response.pop();
        if (quizQnaResponse !== undefined) {
            dataArray.action = postUrl;
            // Assign categoryResponse to formData
            dataArray.formData = quizQnaResponse;
        }

        // Date Format for Modified
        var dt = dateTime.create();
        var formatted = dt.format("Y-m-d H:M:S");

        // Assign formatted date to ModifiedDate property
        dataArray.formData.modifiedDate = formatted;
        console.log(dataArray.formData.answers[1]);
        // Generate dynamic form HTML
        var quizQnaFormHtml = adminFormHelper.getFrom(quizQnaForm(dataArray));

        res.render("quiz/views/quizqna/add_qna", {
            menuHtml: adminMenuHtml.getMenuHtml(),
            collection: quizQnaResponse, 
            title: "Quiz Edit",
            response: quizQnaResponse,
            schemaModel: quizQuestionAnswerSchema,
            form: quizQnaFormHtml,
            id: id,
        });
    });
};


/********************************** Add Quiz action  ********************************************************************/

const addQuizQuestion = async (request, response, next) => {
    var quizId = request.params.quizId ? request.params.quizId : 0;
    const dataArray = new Object();
    var postUrl = "/admin/quizqna/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await QuizQuestionAnswerModel.countDocuments()) + 1;
    dataArray.formData.quizId = quizId;
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

    var quizQuestionAnswerFormHtml = adminFormHelper.getFrom(quizQnaForm(dataArray));
    response.render("quiz/views/quizqna/add_qna", {
        menuHtml: adminMenuHtml.getMenuHtml(),
        title: "Quiz Question Answer Form",
        response: response,
        quizId: quizId,
        form: quizQuestionAnswerFormHtml,
    });
}


/********************************** Update Quiz action  ********************************************************************/

const updateQuizQuestion = async (req, res, next) => {
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

const saveQuizQuestion = async (req, res, next) => {

    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const id = req.body.id ? req.body.id : 0;
    const quizId = req.body.quizId ? req.body.quizId : 0;
    dataArray.formData.id = id;
    dataArray.formData.quizId = quizId;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, quizQnaForm(dataArray), next);
    if (errors) {
        req.flash("errorMsg", errors);
        res.redirect(
            url.format({
                pathname: `/admin/quizqna/add/${quizId}`,
                query: req.body,
            })
        );
    } else {
        const quizQnaDataModel = new Object();
        const prefix = 'answers';
        const answers = [];

        Object.keys(req.body).forEach((key, index) => {
            if (key == '_id' || key == 'Submit') {
                return;
            }
            if (key.startsWith(prefix)) {
                answers.push(req.body[key]);
                return;
            }
            quizQnaDataModel[key]
            quizQnaDataModel['answers'] = answers;
            quizQnaDataModel[key] = req.body[key];
        });

        let newQuizQna = new QuizQuestionAnswerModel(quizQnaDataModel);
        newQuizQna.save(function (err) {
            if (err) {
                if (err) return next(err);;
            } else {
                req.flash("successMsg", "You successfully save this quiz qna");
                res.redirect(`/admin/quizqna/list/${quizId}/1`);
            }
        });
    }
};

/********************************** Delete Quiz action  ********************************************************************/

const deleteQuizQuestion = async function (req, res) {
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



module.exports = { getQuizQuestionListing, editQuizQuestion, addQuizQuestion, updateQuizQuestion, saveQuizQuestion, deleteQuizQuestion };
