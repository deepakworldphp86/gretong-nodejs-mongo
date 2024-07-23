const express = require("express");
var app = require('../../../app_config.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const layoutBackendPath = app.locals.layoutBackendPath;


const multer = require("multer");

const router = express.Router();
const path = require("path");
const url = require("url");
const session = require("express-session");
const mBackend = require(corePath+"/middleware/middleware_backend");
const config = require(corePath+"/utility//config-array");
const html = require(corePath+"/utility//dynamic-html");
const paginate = require(corePath+"/utility//pagination");
const Response = require(corePath+"/utility//response");
const customEvents = require(corePath+"/utility//custom-events");
const dynamicForm = require(corePath+"/utility//dynamic-form");
const { formArray } = require("../models/quiz.form.js");

const { getValidate } = require(corePath+"/utility/validation");
var dateTime = require("node-datetime");

const async = require("async");
const _mongodb = require(corePath+"/config/database.js");
/*************************** Model *********************************/
let {
  QuizModel,
  QuizQuestionAnswerModel,
  quizSchema,
  quizQuestionAnswerSchema,
} = require("../models/quiz.model.js");
console.log('img'+publicPath);
/************************** Upload Config *************************/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicPath+"/admin/uploads/quiz_image/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });
/*************************** Session Config ************************/
app.use(
  session({
    secret: "ilovebeer", // session secret
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: true,
    //store: store,
    saveUninitialized: true,
  })
);

/*************************************** Promises *****************************************************************************/

var loginPromise = new Promise(function (resolve, reject) {
  // do a thing, possibly async, then…
  //console.log('In===================Login Param****************');
  if (1) {
    resolve("Stuff worked!");
  } else {
    reject(Error("It broke"));
  }
});

/********************************** Rendering to Quiz Listing ********************************************************************/

router.get(
  "/list/:page",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var pageUrl = "/admin/quiz/list/";
    QuizModel.find().skip(perPage * currentPage - perPage).limit(perPage)
      .exec(function (err, quizCollection) {
        customEvents.emit("quizLoaded", quizCollection);
        Response.successResponse(req);
        console.log(req.params);
        paginate.getPaginate(QuizModel, req, pageUrl, perPage, currentPage)
          .then((pagaintion) => {
            if (err) return next(err);
            res.render("quiz/views/quiz/list", {
              menuHtml: html.getMenuHtml(),
              title: "Quiz List",
              collection: quizCollection,
              paginationHtml: pagaintion,
              responce: quizCollection,
              data: data,
            });
          });
      });
  }
);

/********************************** Edit Quiz action  ********************************************************************/

router.get("/edit/:Id", mBackend.isAuthorized, function (req, res, next) {
  var Id = req.params.Id ? req.params.Id : 0;
  const dataArray = {};
  dataArray.formData = {};
  
  // Initialize ModifiedDate property inside formData
  dataArray.formData.ModifiedDate = ""; // Assuming ModifiedDate is a string
  
  QuizModel.find({ Id: Id }, async function (err, response) {
    var postUrl = "/admin/category/update/" + Id;
    var categoryResponse = response.pop();
    
    if (categoryResponse !== undefined) {
      dataArray.action = postUrl;
      // Assign categoryResponse to formData
      dataArray.formData = categoryResponse;
    }

    // Date Format for Modified
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    
    // Assign formatted date to ModifiedDate property
    dataArray.formData.ModifiedDate = formatted;

    // Generate dynamic form HTML
    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    
    res.render("quiz/views/quiz/add", {
      menuHtml: html.getMenuHtml(),
      collection: categoryResponse, // Use categoryResponse for collection
      title: "Quiz Edit",
      response: categoryResponse,
      schemaModel: quizSchema,
      form: dynamicFormHtml,
      Id: Id,
    });
  });
});


/********************************** Add Quiz action  ********************************************************************/

router.get(
  "/add",
  mBackend.isAuthorized,
  async function (request, response, next) {
    const dataArray = new Object();
    var postUrl = "/admin/quiz/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await QuizModel.countDocuments()) + 1; // Int Id of Category
    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.CreatedDate = formatted; // Created Date

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    response.render("quiz/views/quiz/add", {
      menuHtml: html.getMenuHtml(),
      title: "Quiz Form",
      response: response,
      form: dynamicFormHtml,
    });
  }
);

/********************************** Update Quiz action  ********************************************************************/

router.post(
  "/update/:Id",
  upload.single("image"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.Id = req.body.Id;
    dataArray.formData.ParentId = req.body.ParentId;

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);

    // callback();
    const Id = req.body.Id;
    var CategoryImage = "";

    // Start Image and Validation
    if (req.file == undefined) {
      CategoryImage = req.body.CategoryImage;
    } else {
      CategoryImage = req.file.filename;
    }

    if (errors || !CategoryImage) {
      req.flash("error_msg", errors);
      res.redirect(
        url.format({
          pathname: "/admin/category/edit/" + Id,
          response: req.body,
        })
      );
    } else {
      var objectCat = new Object();
      objectCat.Id = req.body.Id;
      objectCat.Code = req.body.Code;
      objectCat.Name = req.body.Name;
      objectCat.ParentId = req.body.ParentId;
      objectCat.Active = req.body.Active;
      objectCat.CreatedDate = req.body.CreatedDate;
      objectCat.ModifiedDate = req.body.ModifiedDate || "";
      objectCat.ExternalId = req.body.ExternalId;
      objectCat.StoreId = req.body.StoreId;
      objectCat.UpdateRequired = req.body.UpdateRequired;
      objectCat.CategoryImage = CategoryImage;
      const ParentId = req.body.ParentId;
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
            req.flash("success_msg", "You successfully Update this category");
            res.redirect("/admin/category/list/1");
          }
        }
      );
    }
  }
);

/********************************** Save Quiz action  ********************************************************************/

router.post("/save", upload.single("image"), async function (req, res, next) {
  var errors = [];
  const dataArray = new Object();
  dataArray.formData = {};
  dataArray.action = "";
  const id = req.body.id ? req.body.id : 0;
  dataArray.formData.id = id;
  mBackend.isAuthorized;
  errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);

  if (!req.file && !errors) {
    errors = [];
    errors.push({ msg: "Image is required filed" });
  } else if (!req.file) {
    errors.push({ msg: "Image is required filed" });
  }

  if (errors || !req.file.filename) {
    req.flash("error_msg", errors);
    res.redirect(
      url.format({
        pathname: "/admin/quiz/add/",
        query: req.body,
      })
    );
  } else {
    const image = req.file.filename;
    let newQuiz = new QuizModel({
      id: req.body.id,
      code: req.body.code,
      name: req.body.name,
      active: req.body.active,
      created_date: req.body.created_date,
      modified_date: req.body.modified_date,
      store_id: req.body.store_id,
      update_required: req.body.update_required,
      image: image,
    });
    newQuiz.save(function (err) {
      if (err) {
        return;
      } else {
        req.flash("success_msg", "You successfully save this quiz");
        res.redirect("/admin/quiz/list/1");
      }
    });
  }
});

/********************************** Delete Quiz action  ********************************************************************/

router.get("/delete", function (req, res) {
  var id = req.query.id ? req.query.id : 0;
  var parent_id = req.query.parent_id ? req.query.parent_id : 0;
  var objectCat = new Object();
  objectCat._id = id.trim();

  QuizModel.countDocuments({ parent_category: id.trim() }).then((count) => {
    customEvents.emit(
      "categoryDeleteBefore",
      "Count of child categorys" + count
    );
    if (count === 0) {
      QuizModel.findOneAndRemove(objectCat, function (err) {
        if (err) {
          customEvents.emit("categoryDeleteFailed", err);
          res.redirect("/admin/category/list?id=" + parent_id);
        } else {
          customEvents.emit("categoryDeleted", "Category Has been Deleted");
          req.flash("success_msg", "You successfully deleted this category.");
          res.redirect("/admin/category/list?id=" + parent_id);
        }
      });
    } else {
      let errors = [];

      errors.push({ msg: "Please delete child category first." });
      customEvents.emit("categoryDeleteFailed", errors);
      req.flash("error_msg", errors);
      res.redirect("/admin/category/list?id=" + parent_id);
    }
  });
});



module.exports = router;
