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
const mBackend = require(corePath+"/middleware/helper/middleware_backend.js");
const config = require(corePath+"/utility/helper/config-array");
const html = require(corePath+"/utility/helper/dynamic-html");
const paginate = require(corePath+"/utility/helper/pagination");
const Response = require(corePath+"/utility/helper/response");
const customEvents = require(corePath+"/utility/helper/custom-events");
const dynamicForm = require(corePath+"/utility/helper/dynamic-form");
const { formArray } = require("../models/categories.form.js");

const { getValidate } = require(corePath+"/utility/helper/validation");
var dateTime = require("node-datetime");

const async = require("async");
const _mongodb = require(corePath+"/security/helper/database.js");
/*************************** Model *********************************/
let { CategoriesModel, schema } = require("../models/categories.model.js");

/************************** Upload Config *************************/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicPath+"/admin/uploads/category_image/");
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

/********************************** Rendering to categories Listing ********************************************************************/

router.get(
  "/list/:Id/:page",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    var Id = req.params.Id ? req.params.Id : 0;
    var perPage = 2;
    var currentPage = req.params.page || 1;
    console.log(req.params);
    var pageUrl = "/admin/category/list/" + Id + "/";
    var filter = { ParentId: Id };
    CategoriesModel.find({ ParentId: Id })
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, catCollection) {
        customEvents.emit("categoryLoaded", catCollection);
        Response.successResponse(req);
        paginate
          .getPaginate(
            CategoriesModel,
            filter,
            req,
            pageUrl,
            perPage,
            currentPage
          )
          .then((pagaintion) => {
            if (err) return next(err);
            res.render(modulesPath+"/category/views/list", {
              menuHtml: html.getMenuHtml(),
              title: "Categorys",
              collection: catCollection,
              paginationHtml: pagaintion,
              responce: catCollection,
              Id: Id,
              data: data,
            });
          });
      });
  }
);

/********************************** Edit categories action  ********************************************************************/

router.get("/edit/:Id", mBackend.isAuthorized, function (req, res, next) {
  var Id = req.params.Id ? req.params.Id : 0;
  const dataArray = new Object();

  CategoriesModel.find({ Id: Id }, async function (err, response) {
    var postUrl = "/admin/category/update/" + Id;
    var response = response.pop();
    dataArray.formData = response;
    //console.log(dataArray);return;
    if (response !== undefined) {
      dataArray.action = postUrl;
    }

    //Date Format for Modified
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.ModifiedDate = formatted; // ModifiedDate Date

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    res.render(modulesPath+"/category/views/add", {
      menuHtml: html.getMenuHtml(),
      collection: response,
      title: "Category Edit",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      Id: Id,
    });
  });
});

/********************************** Add categories action  ********************************************************************/

router.get(
  "/add/:ParentId",
  mBackend.isAuthorized,
  async function (request, response, next) {
    const dataArray = new Object();
    var postUrl = "/admin/category/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.Id = (await CategoriesModel.count()) + 1; // Int Id of Category
    dataArray.formData.ParentId = request.params.ParentId
      ? request.params.ParentId
      : 0; // Parent Id of Category

    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.CreatedDate = formatted; // Created Date

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    response.render(modulesPath+"/category/views/add", {
      menuHtml: html.getMenuHtml(),
      title: "Categorys Form",
      response: response,
      form: dynamicFormHtml,
    });
  }
);

/********************************** Update categories action  ********************************************************************/

router.post(
  "/update/:Id",
  upload.single("CategoryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.Id = req.body.Id;
    dataArray.formData.ParentId = req.body.ParentId;

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req,res,formArray(dataArray),next);

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
      objectCat.CreatedDate = req.body.CreatedDate ;
      objectCat.ModifiedDate = req.body.ModifiedDate || '';
      objectCat.ExternalId = req.body.ExternalId;
      objectCat.StoreId = req.body.StoreId;
      objectCat.UpdateRequired = req.body.UpdateRequired;
      objectCat.CategoryImage = CategoryImage;
      const ParentId = req.body.ParentId;
      ///console.log(objectCat);return;
      CategoriesModel.findByIdAndUpdate(
        req.body._id,
        objectCat,
        { upsert: true },
        function (err, num, n) {
          if (err) {
            throw err;
          } else {
            //console.log(newCategory);
            req.flash("success_msg", "You successfully Update this category");
            res.redirect("/admin/category/list/" + ParentId + "/1");
          }
        }
      );
    }
  }
);

/********************************** Save categories action  ********************************************************************/

router.post(
  "/save",
  upload.single("CategoryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const ParentId = req.body.ParentId ? req.body.ParentId : 0;
    dataArray.formData.ParentId = ParentId;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req,res,formArray(dataArray),next);
    
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
          pathname: "/admin/category/add/" + ParentId,
          query: req.body,
        })
      );
    } else {
      const image = req.file.filename;
      let newCategory = new CategoriesModel({
        Id: req.body.Id,
        Code: req.body.Code,
        Name: req.body.Name,
        ParentId: ParentId,
        Active: req.body.Active,
        CreatedDate: req.body.CreatedDate,
        ModifiedDate: req.body.ModifiedDate,
        ExternalId: req.body.ExternalId,
        StoreId: req.body.StoreId,
        UpdateRequired: req.body.UpdateRequired,
        CategoryImage: image,
      });
      newCategory.save(function (err) {
        if (err) {
          return;
        } else {
          req.flash("success_msg", "You successfully save this category");
          res.redirect("/admin/category/list/0/1");
        }
      });
    }
  }
);

/********************************** Delete categories action  ********************************************************************/

router.get("/delete", function (req, res) {
  var id = req.query.id ? req.query.id : 0;
  var parent_id = req.query.parent_id ? req.query.parent_id : 0;
  var objectCat = new Object();
  objectCat._id = id.trim();

  CategoriesModel.count({ parent_category: id.trim() }).then((count) => {
    customEvents.emit(
      "categoryDeleteBefore",
      "Count of child categorys" + count
    );
    if (count === 0) {
      CategoriesModel.findOneAndRemove(objectCat, function (err) {
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
