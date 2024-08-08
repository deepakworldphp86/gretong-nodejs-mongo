const express = require("express");
var app = require('../../../app_config.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const layoutBackendPath = app.locals.layoutBackendPath;
const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const url = require("url");
const session = require("express-session");
const mBackend = require(corePath + "/middleware/middleware_backend.js");
const config = require(corePath + "/utility/config-array");
const html = require(corePath + "/utility/backend-menu-html");
const paginate = require(corePath + "/utility/pagination");
const Response = require(corePath + "/utility/response");
const customEvents = require(corePath + "/utility/custom-events");
const dynamicForm = require(corePath + "/utility/dynamic-form");
const { formArray } = require("../models/product.form.js");

const { getValidate } = require(corePath + "/utility/validation");
var dateTime = require("node-datetime");

const async = require("async");
const _mongodb = require(corePath + "/config/database.js");
/*************************** Model *********************************/
let { productModel, schema } = require("../models/product.model.js");
let { categoriesModel, schemaCategories } = require('../../category/models/category.model.js');


/************************** Upload Config *************************/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicPath + "/admin/uploads/product_images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

/********************************** Rendering to Product Listing ********************************************************************/

router.get(
  "/list/:page",
  mBackend.isAuthorized,
  async function (req, res, next) {
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var filter = {};
    var pageUrl = "/admin/product/list/";

    productModel.find(filter)
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, productCollection) {
        customEvents.emit("Product List Loaded", productCollection);
        paginate
          .getPaginate(
            productModel.find(filter),
            req,
            pageUrl,
            perPage,
            currentPage
          )
          .then((pagaintion) => {
            if (err) return next(err);
            res.render(modulesPath + "/product/views/list", {
              menuHtml: html.getMenuHtml(),
              title: "Product",
              collection: productCollection,
              paginationHtml: pagaintion,
              responce: productCollection,
              data: data,
            });
          });
      });
  }
);

/********************************** Edit Product action  ********************************************************************/

router.get("/edit/:id", mBackend.isAuthorized, function (req, res, next) {
  var id = req.params.id ? req.params.id : 0;
  const dataArray = new Object();

  productModel.find({ id: id }, async function (err, response) {
    var postUrl = "/admin/product/update/" + id;
    var response = response.pop();
    dataArray.formData = response;
    //console.log(dataArray);return;
    if (response !== undefined) {
      dataArray.action = postUrl;
    }
    var filter = {};
    const categories = await categoriesModel.find(filter);

    // Create key-value pairs
    const mappedCategoryData = categories.reduce((categoryMap, category) => {
      categoryMap[category.id] = category.name;
      return categoryMap;
    }, {});

   
    //Date Format for Modified
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.modifiedDate = formatted; // ModifiedDate Date
    dataArray.formData.categoriesOption = mappedCategoryData;

    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));

    res.render(modulesPath + "/product/views/add", {
      menuHtml: html.getMenuHtml(),
      collection: response,
      title: "Product Edit",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      id: id,
    });
  });
});

/********************************** Add categories action  ********************************************************************/

router.get(
  "/add",
  mBackend.isAuthorized,
  async function (request, response, next) {
    const dataArray = new Object();

    // Fetch all categories
    const filter = {};
    const categories = await categoriesModel.find(filter);

    // Create key-value pairs
    const mappedCategoryData = categories.reduce((categoryMap, category) => {
      categoryMap[category.id] = category.name;
      return categoryMap;
    }, {});

    var postUrl = "/admin/product/save";
    dataArray.action = postUrl;
    dataArray.formData = {};
    dataArray.formData.categoriesOption = mappedCategoryData;
    dataArray.formData.id = (await productModel.countDocuments()) + 1;

    //Date Format for CreatedDate
    var dt = dateTime.create();
    var formatted = dt.format("Y-m-d H:M:S");
    dataArray.formData.createdDate = formatted; // Created Date
   
    var dynamicFormHtml = dynamicForm.getFrom(formArray(dataArray));
    response.render(modulesPath + "/product/views/add", {
      menuHtml: html.getMenuHtml(),
      title: "Product Form",
      response: response,
      form: dynamicFormHtml,
    });
  }
);

/********************************** Update categories action  ********************************************************************/

router.post(
  "/update/:id",
  upload.single("productGalleryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.formData.id = req.body.id;
   
    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);

    // callback();
    const id = req.body.id;
    var productGalleryImage = "";

    // Start Image and Validation
    if (req.file == undefined) {
      productGalleryImage = req.body.productGalleryImage;
    } else {
      productGalleryImage = req.file.filename;
    }

    if (errors || !productGalleryImage) {
      req.flash("errorMsg", errors);
      res.redirect(
        url.format({
          pathname: "/admin/product/edit/" + id,
          response: req.body,
        })
      );
    } else {
      var objectProd = new Object();
      objectProd.id = req.body.id;
      objectProd.sku = req.body.sku;
      objectProd.name = req.body.name;
      objectProd.price = req.body.price;
      objectProd.status = req.body.status;
      objectProd.bestSeller = req.body.bestseller;
      objectProd.newProduct = req.body.newproduct;
      objectProd.crossSell = req.body.crosssell;
      objectProd.description = req.body.description;
      objectProd.categories = req.body.categories;
      objectProd.createdDate = req.body.createdDate;
      objectProd.modifiedDate = req.body.modifiedDate || '';
      objectProd.storeId = req.body.storeId;
      objectProd.updateRequired = req.body.updateRequired;
      objectProd.productGalleryImage = productGalleryImage;

     //console.log(objectProd);return;
      productModel.findByIdAndUpdate(
        req.body._id,
        objectProd,
        { upsert: true },
        function (err, num, n) {
          if (err) {
            throw err;
          } else {
            req.flash("successMsg", "You successfully Update this product");
            res.redirect("/admin/product/list/1");
          }
        }
      );
    }
  }
);

/********************************** Save categories action  ********************************************************************/

router.post(
  "/save",
  upload.single("productGalleryImage"),
  async function (req, res, next) {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);
    // Generate a unique sequential ID
    let productId = await generateUniqueProductId();


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
          pathname: "/admin/product/add/",
          query: req.body,
        })
      );
    } else {
      const productGalleryImage = req.file.filename;
     
      let newProduct = new productModel({
        id: productId,
        sku: req.body.sku,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        bestSeller: req.body.bestseller,
        newProduct: req.body.newproduct,
        crossSell: req.body.crosssell,
        categories: req.body.categories,
        status: req.body.status,
        createdDate: req.body.createdDate,
        modifiedDate: req.body.modifiedDate || '',
        storeId: req.body.storeId,
        updateRequired: req.body.updateRequired,
        productGalleryImage: productGalleryImage
      });
      //console.log(newProduct);return;
      newProduct.save(function (err) {
        if (err) {
          if (err) return next(err);
        } else {
          req.flash("successMsg", "You successfully save this product");
          res.redirect("/admin/product/list/1");
        }
      });
    }
  }
);

/********************************** Delete categories action  ********************************************************************/

router.get("/delete/:_id", function (req, res) {
 
  var id = req.params._id ? req.params._id : 0;
  var objectProd = new Object();
  objectProd._id = id.trim();
  productModel.findOneAndRemove(objectProd, function (err) {
    if (err) {
      customEvents.emit("productDeleteBefore", err);
      res.redirect("/admin/product/list/1");
    } else {
      customEvents.emit("productDeleted", "Product Has been Deleted");
      req.flash("successMsg", "You successfully deleted this Product.");
      res.redirect("/admin/product/list/1");
    }
  });
});

// Function to generate a unique sequential ID
async function generateUniqueProductId() {
  let productId = await findNextAvailableId(1); // Start checking from ID 1

  return productId;
}

// Recursive function to find the next available unique ID
async function findNextAvailableId(candidateId) {
  // Check if the candidate ID exists in the database
  let product = await productModel.findOne({ id: candidateId }).exec();

  if (product) {
    // If the ID exists, recursively call findNextAvailableId with incremented candidateId
    return findNextAvailableId(candidateId + 1);
  } else {
    // If the ID does not exist, return the candidateId as the next available ID
    return candidateId;
  }
}



module.exports = router;
