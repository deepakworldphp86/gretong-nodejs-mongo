var app = require('../../../appConfig.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const multer = require("multer");
const url = require("url");
const mBackend = require(corePath + "/middlewares/middlewareAdmin.js");
const adminMenuHtml =  require(corePath + "/utility/adminMenuHtml");
const paginate = require(corePath + "/utility/adminPaginationHelper");
const adminCustomEvents = require(corePath + "/utility/adminCustomEvents");
const dynamicForm = require(corePath + "/utility/adminFormHelper");
const { formArray } = require("../models/productForm.js");
const productHelper = require('../helpers/productHelper.js');
var dateTime = require("node-datetime");

/*************************** Model *********************************/
let { productModel, schema } = require("../models/productModel.js");
let { categoriesModel, schemaCategories } = require('../../category/models/categoryModel.js');

/********************************** Rendering to Product Listing ********************************************************************/

const getProductList = async  (req, res, next) => {
    var data = [];
    var perPage = 2;
    var currentPage = req.params.page || 1;
    var filter = {};
    var pageUrl = "/admin/product/list/";

    productModel.find(filter)
      .skip(perPage * currentPage - perPage)
      .limit(perPage)
      .exec(function (err, productCollection) {
        adminCustomEvents.emit("Product List Loaded", productCollection);
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
              menuHtml: adminMenuHtml.getMenuHtml(),
              title: "Product",
              collection: productCollection,
              paginationHtml: pagaintion,
              responce: productCollection,
              data: data,
            });
          });
      });
  }


/********************************** Edit Product action  ********************************************************************/
const editProduct = async  (req, res, next) => {
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
      menuHtml: adminMenuHtml.getMenuHtml(),
      collection: response,
      title: "Product Edit",
      response: response,
      schemaModel: schema,
      form: dynamicFormHtml,
      id: id,
    });
  });
};

/********************************** Add product action  ********************************************************************/
const addProduct = async  (req, res, next) => {
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
    res.render(modulesPath + "/product/views/add", {
      menuHtml: adminMenuHtml.getMenuHtml(),
      title: "Product Form",
      response: res,
      form: dynamicFormHtml,
    });
  }


/********************************** Update categories action  ********************************************************************/
const updateProduct = async  (req, res, next) => {
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


/********************************** Save categories action  ********************************************************************/
const saveProduct = async  (req, res, next) => {
    var errors = [];
    const dataArray = new Object();
    dataArray.formData = {};
    dataArray.action = "";

    mBackend.isAuthorized;
    errors = mBackend.isFormValidated(req, res, formArray(dataArray), next);
    // Generate a unique sequential ID
    let productId = await productHelper.generateUniqueProductId();


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

/********************************** Delete categories action  ********************************************************************/
const deleteProduct = async  (req, res, next) => {

  var id = req.params._id ? req.params._id : 0;
  var objectProd = new Object();
  objectProd._id = id.trim();
  productModel.findOneAndRemove(objectProd, function (err) {
    if (err) {
      adminCustomEvents.emit("productDeleteBefore", err);
      res.redirect("/admin/product/list/1");
    } else {
      adminCustomEvents.emit("productDeleted", "Product Has been Deleted");
      req.flash("successMsg", "You successfully deleted this Product.");
      res.redirect("/admin/product/list/1");
    }
  });
}

module.exports = {
    getProductList,
    editProduct,
    addProduct,
    updateProduct,
    saveProduct,
    deleteProduct,
  };