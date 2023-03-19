const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const url = require("url");
const session = require("express-session");
const auth = require("../middleware/auth_backend");
const config = require("../utility/config-array");
const html = require("../utility/dynamic-html");
const paginate = require("../utility/pagination");
const Response = require("../utility/response");
const customEvents = require("../utility/custom-events");
const dynamicForm = require("../utility/dynamic-form");
const { getValidate } = require("../utility/validation");

const async = require("async");
const app = express();
const _mongodb = require("../config/database.js");
/*************************** Model *********************************/
let {
  CategoriesModel,
  schema,
  formArray,
} = require("../models/categories.model.js");

/************************** Upload Config *************************/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/admin/uploads");
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

  if (1) {
    resolve("Stuff worked!");
  } else {
    reject(Error("It broke"));
  }
});

/********************************** Rendering to categories Listing ********************************************************************/

router.get("/list/:page", auth.isAuthorized, async function (req, res, next) {
  var data = [];
  var id = req.query.id ? req.query.id : 0;
  var perPage = 9;
  var currentPage = req.params.page || 1;
  var url = req.url;
  var pageUrl = "/admin/category/list/";

  //console.log(url);
  CategoriesModel.find({})
    .skip(perPage * currentPage - perPage)
    .limit(perPage)
    .exec(function (err, catCollection) {
      customEvents.emit("categoryLoaded", catCollection);
      Response.successResponse(req);

      //CategoriesModel.count().exec(function (err, count) {
      paginate
        .getPaginate(CategoriesModel, req, pageUrl, perPage, currentPage)
        .then((pagaintion) => {
          if (err) return next(err);
          res.render("admin/categories_list", {
            menuHtml: html.getMenuHtml(),
            title: "Categorys",
            collection: catCollection,
            paginationHtml: pagaintion,
            responce: catCollection,
            id: id,
            data: data,
          });
        });
      ///});
    });
});

/********************************** Edit categories action  ********************************************************************/

router.get("/edit", auth.isAuthorized, function (req, res, next) {
  var id = req.query.id ? req.query.id : 0;
  const dataArray = new Object();

  CategoriesModel.find({ _id: id }, async function (err, response) {
    var postUrl = "/admin/category/update";
    var response = response.pop();
    dataArray.formData = response;
    dataArray.upload_path = '/admin/uploads/';
    if (response !== undefined) {
      dataArray.action = postUrl;
    }
    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));

    // console.log(dataArray);
    // return;
    res.render("admin/categories_add", {
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
  "/add/:id",
  auth.isAuthorized,
  async function (request, response, next) {
    const dataArray = new Object();
    var id = request.params.id ? request.params.id : 0;
    var postUrl = "/admin/category/save";
    dataArray.formData = {};
    dataArray.action = postUrl;
    dataArray.formData.entity_id = (await CategoriesModel.count()) + 1;
    dataArray.formData.Id =  dataArray.formData.entity_id;
    dataArray.formData.ParentId = (request.params.ParentId) ? request.params.ParentId : 0; 

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    response.render("admin/categories_add", {
      menuHtml: html.getMenuHtml(),
      title: "Categorys Form",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      id: id,
    });
  }
);

/********************************** Update categories action  ********************************************************************/

router.post(
  "/update",
  upload.single("CategoryImage"),
  function (req, res, next) {
    auth.isAuthorized;
    callback();
    const id = req.body.id;
    var categories_image = req.body.categories_image;
    if (req.file != undefined) {
      var CategoryImage = req.file.filename;
    }

    var errors = [];
    errors = getValidate(req, formArray(dataArray));
    if (!req.file && !errors) {
      errors = [];
      errors.push({ msg: "Image is required filed" });
    } else if (!req.file) {
      errors.push({ msg: "Image is required filed" });
    }

    if (errors || !categories_image) {
      req.flash("error_msg", errors);
      res.redirect(
        url.format({
          pathname: "/admin/category/edit?id=" + id,
          response: req.body,
        })
      );
    } else {
      var objectCat = new Object();
      objectCat.categories = req.body.categories;
      objectCat.categories_description = req.body.categories_description;
      objectCat.categories_content = req.body.categories_content;
      objectCat.categories_image = categories_image;
      objectCat.parent_id = req.body.parent_id;
      //console.log(objectCat);return;
      CategoriesModel.findByIdAndUpdate(
        req.body.id,
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

/********************************** Save categories action  ********************************************************************/

router.post(
  "/save",
  upload.single("CategoryImage"),
  async function (req, res, next) {
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";
    const ParentId = (req.body.ParentId) ? req.body.ParentId : 0; 
    dataArray.formData.ParentId  = ParentId;
    auth.isAuthorized;
    const id = req.body.id;
    var errors = [];
    errors = getValidate(req, formArray(dataArray));
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
          pathname: "/admin/category/add/" + id,
          query: req.body,
        })
      );
    } else {
      const image = req.file.filename;
      const id = req.file.Id;
      let newCategory = new CategoriesModel({
        entity_id: req.body.entity_id,
        Id: req.body.Id,
        Code: req.body.Code,
        Name: req.body.Name,
        ParentId: ParentId,
        Active: req.body.Active,
        CreatedDate: req.body.CreatedDate,
        ModifiedDate: req.body.ModifiedDate,
        ExternalId: req.body.ExternalId,
        ChannelId: req.body.ChannelId,
        UpdateRequired: req.body.UpdateRequired,
        CategoryImage: image,
      });
      newCategory.save(function (err) {
        if (err) {
          return;
        } else {
          req.flash("success_msg", "You successfully save this category");
          res.redirect("/admin/category/list/1");
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
      Categories.findOneAndRemove(objectCat, function (err) {
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

/********************************** forwarding 404 action  ********************************************************************/
app.use(function (req, res, next) {
  //next(createError(404));
  res.status(400);
  res.render("404", { title: "404: File Not Found" });
});

module.exports = router;
