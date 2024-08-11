// Import necessary modules and models
var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;

const url = require("url");
const dateTime = require("node-datetime");
const { formArray } = require("../models/categoryForm.js");
const { categoriesModel, schema } = require("../models/categoryModel.js");
const mBackend = require(corePath + "/middlewares/middlewareAdmin.js");
const paginate = require(corePath + "/utility/adminPaginationHelper");
const adminMenuHtml = require(corePath + "/utility/adminMenuHtml");
const adminCustomEvents = require(corePath + "/utility/adminCustomEvents");
const dynamicForm = require(corePath + "/utility/adminFormHelper");

// Get categories list
async function getCategoriesList(req, res, next) {
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
      adminCustomEvents.emit("categoryLoaded", catCollection);
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
          res.render(modulesPath + "/category/views/list", {
            menuHtml: adminMenuHtml.getMenuHtml(),
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


// Edit category
function editCategory(req, res, next) {
  var id = req.params.id ? req.params.id : 0;
  const dataArray = new Object();

  categoriesModel.find({ id: id }, async function (err, result) {
    var postUrl = "/admin/category/update/" + id;
    var response = result;
    dataArray.formData = result.pop();


    if (response !== undefined) {
      dataArray.action = postUrl;
    }

    //Date Format for Modified
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.modifiedDate = formatted; // ModifiedDate Date

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    res.render(modulesPath + "/category/views/add", {
      menuHtml: adminMenuHtml.getMenuHtml(),
      collection: response,
      title: "Category Edit",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      id: id,
    });
  });
}

// Add category
async function addCategory(req, res, next) {
  const dataArray = new Object();
  var postUrl = "/admin/category/save";
  dataArray.formData = {};
  dataArray.action = postUrl;
  dataArray.formData.id = (await categoriesModel.countDocuments()) + 1; // Int Id of Category
  dataArray.formData.parentId = req.params.parentId
    ? req.params.parentId
    : 0; // Parent Id of Category

  //Date Format for CreatedDate
  var dt = dateTime.create();
  var formatted = dt.format("Y-m-d H:M:S");
  dataArray.formData.createdDate = formatted; // Created Date

  var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
  res.render(modulesPath + "/category/views/add", {
    menuHtml: adminMenuHtml.getMenuHtml(),
    title: "Categorys Form",
    response: res,
    form: dynamicFormHtml,
  });
}

// Update category
async function updateCategory(req, res, next) {
  var errors = [];
  const dataArray = new Object();
  dataArray.formData = {};
  dataArray.formData.id = req.body.id;
  dataArray.formData.parentId = req.body.parentId;

  mBackend.isAuthorized;
  errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);

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
    objectCat.createdDate = req.body.createdDate;
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

// Save category
async function saveCategory(req, res, next) {
  var errors = [];
  const dataArray = new Object();
  dataArray.formData = {};
  dataArray.action = "";
  const parentId = req.body.parentId ? req.body.parentId : 0;
  dataArray.formData.parentId = parentId;
  mBackend.isAuthorized;
  errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);

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

// Delete category
function deleteCategory(req, res) {
  var id = req.params.id ? req.params.id : 0;
  var parentId = req.params.parentId ? req.params.parentId : 0;
  var objectCat = new Object();
  objectCat.id = id;

  categoriesModel.countDocuments({ parentId: id }).then((count) => {
    adminCustomEvents.emit(
      "categoryDeleteBefore",
      "Count of child categorys" + count
    );

    console.log('count', count, id, parentId, req.params);
    if (count === 0) {
      categoriesModel.findOneAndRemove(objectCat, function (err) {
        if (err) {
          adminCustomEvents.emit("categoryDeleteFailed", err);
          res.redirect(`/admin/category/list/${parentId}/1`);
        } else {
          adminCustomEvents.emit("categoryDeleted", "Category Has been Deleted");
          req.flash("successMsg", "You successfully deleted this category.");
          res.redirect(`/admin/category/list/${parentId}/1`);

        }
      });
    } else {
      let errors = [];

      errors.push({ msg: "Please delete child category first." });
      adminCustomEvents.emit("categoryDeleteFailed", errors);
      req.flash("errorMsg", errors);
      res.redirect(`/admin/category/list/${parentId}/1`);
    }
  });
}

// Export the controller functions
module.exports = {
  getCategoriesList,
  editCategory,
  addCategory,
  updateCategory,
  saveCategory,
  deleteCategory,
};
