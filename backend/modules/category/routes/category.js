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
const mBackend = require(corePath+"/middleware/middleware_backend.js");
const config = require(corePath+"/utility/config-array");
const html = require(corePath+"/utility/backend-menu-html");
const paginate = require(corePath+"/utility/pagination");
const Response = require(corePath+"/utility/response");
const customEvents = require(corePath+"/utility/custom-events");
const dynamicForm = require(corePath+"/utility/dynamic-form");
const { formArray } = require("../models/category.form.js");

const { getValidate } = require(corePath+"/utility/validation");
var dateTime = require("node-datetime");

const async = require("async");
const _mongodb = require(corePath+"/config/database.js");
/*************************** Model *********************************/
let { categoriesModel, schema } = require("../models/category.model.js");

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

/********************************** Rendering to categories Listing ********************************************************************/

router.get(
  "/list/:id/:page",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    var id = req.params.id ? req.params.id : 0;
    var perPage = 2;
    var currentPage = req.params.page || 1;
   
    var pageUrl = "/admin/category/list/" + id + "/";
    var filter = { parentId: id };
    
    categoriesModel.find(filter)
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, catCollection) {
        customEvents.emit("categoryLoaded", catCollection);
        paginate
          .getPaginate(
            categoriesModel.find(filter),
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
              id: id,
              data: data,
            });
          });
      });
  }
);

/********************************** Edit categories action  ********************************************************************/

router.get("/edit/:id", mBackend.isAuthorized, function (req, res, next) {
  var id = req.params.id ? req.params.id : 0;
  const dataArray = new Object();

  categoriesModel.find({ id: id }, async function (err, response) {
    var postUrl = "/admin/category/update/" + id;
    var response = response.pop();
    dataArray.formData = response;
   

    if (response !== undefined) {
      dataArray.action = postUrl;
    }

    //Date Format for Modified
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.modifiedDate = formatted; // ModifiedDate Date
    
    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    res.render(modulesPath+"/category/views/add", {
      menuHtml: html.getMenuHtml(),
      collection: response,
      title: "Category Edit",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      id: id,
    });
  });
});

/********************************** Add categories action  ********************************************************************/

router.get(
  "/add/:parentId",
  mBackend.isAuthorized,
  async function (request, response, next) {
    const dataArray = new Object();
    var postUrl = "/admin/category/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.id = (await categoriesModel.countDocuments()) + 1; // Int Id of Category
    dataArray.formData.parentId = request.params.parentId
      ? request.params.parentId
      : 0; // Parent Id of Category

    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date

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
  "/update/:id",
  upload.single("categoryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.id = req.body.id;
    dataArray.formData.parentId = req.body.parentId;

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req,res,formArray(dataArray),next);

    // callback();
    const Id = req.body.id;
    var categoryImage = "";

    // Start Image and Validation
    if (req.file == undefined) {
      categoryImage = req.body.categoryImage;
    } else {
      categoryImage = req.file.filename;
    }

    if (errors || !categoryImage) {
      req.flash("errorMsg", errors);
      res.redirect(
        url.format({
          pathname: "/admin/category/edit/" + Id,
          response: req.body,
        })
      );
    } else {
      var objectCat = new Object();
      objectCat.id = req.body.id;
      objectCat.code = req.body.code;
      objectCat.name = req.body.name;
      objectCat.description = req.body.description;
      objectCat.parentId = req.body.parentId;
      objectCat.status = req.body.status;
      objectCat.createdDate = req.body.createdDate ;
      objectCat.modifiedDate = req.body.modifiedDate || '';
      objectCat.externalId = req.body.externalId;
      objectCat.storeId = req.body.storeId;
      objectCat.updateRequired = req.body.updateRequired;
      objectCat.categoryImage = categoryImage;
      const parentId = req.body.parentId;
      
      categoriesModel.findByIdAndUpdate(
        req.body._id,
        objectCat,
        { upsert: true },
        function (err, num, n) {
          if (err) {
            throw err;
          } else {
            req.flash("successMsg", "You successfully Update this category");
            res.redirect("/admin/category/list/" + parentId + "/1");
          }
        }
      );
    }
  }
);

/********************************** Save categories action  ********************************************************************/

router.post(
  "/save",
  upload.single("categoryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const parentId = req.body.parentId ? req.body.parentId : 0;
    dataArray.formData.parentId = parentId;
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req,res,formArray(dataArray),next);
   
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
          pathname: "/admin/category/add/" + parentId,
          query: req.body,
        })
      );
    } else {
      const categoryImage = req.file.filename;
      let newCategory = new categoriesModel({
        id: req.body.id,
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        parentId: parentId,
        status: req.body.status,
        createdDate: req.body.createdDate,
        modifiedDate: req.body.modifiedDate,
        externalId: req.body.externalId,
        storeId: req.body.storeId,
        updateRequired: req.body.updateRequired,
        categoryImage: categoryImage,
      });
      newCategory.save(function (err) {
        if (err) {
          if (err) return next(err);
        } else {
          req.flash("successMsg", "You successfully save this category");
          res.redirect("/admin/category/list/0/1");
        }
      });
    }
  }
);

/********************************** Delete categories action  ********************************************************************/

router.get("/delete/:id/:parentId", function (req, res) {
  var id = req.params.id ? req.params.id : 0;
  var parentId = req.params.parentId ? req.params.parentId : 0;
  var objectCat = new Object();
  objectCat.id = id;

  categoriesModel.countDocuments({ parentId: id }).then((count) => {
    customEvents.emit(
      "categoryDeleteBefore",
      "Count of child categorys" + count
    );

    console.log('count',count,id,parentId,req.params);
    if (count === 0) {
      categoriesModel.findOneAndRemove(objectCat, function (err) {
        if (err) {
          customEvents.emit("categoryDeleteFailed", err);
          res.redirect(`/admin/category/list/${parentId}/1`);
        } else {
          customEvents.emit("categoryDeleted", "Category Has been Deleted");
          req.flash("successMsg", "You successfully deleted this category.");
          res.redirect(`/admin/category/list/${parentId}/1`);
         
        }
      });
    } else {
      let errors = [];

      errors.push({ msg: "Please delete child category first." });
      customEvents.emit("categoryDeleteFailed", errors);
      req.flash("errorMsg", errors);
      res.redirect(`/admin/category/list/${parentId}/1`);
    }
  });
});


module.exports = router;
