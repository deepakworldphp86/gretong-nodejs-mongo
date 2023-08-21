const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const url = require("url");
const mongoosePaginate = require("mongoose-paginate-v2");

const session = require("express-session");
const auth = require("../middleware/middleware_backend");
const config = require("../utility/config-array");
const html = require("../utility/dynamic-html");
const Response = require("../utility/response");
const customEvents = require("../utility/custom-events");
const async = require("async");
const app = express();
const _mongodb = require("../config/database.js");
/*************************** Model *********************************/
let CategoriesModel = require("../models/categories.model.js");
let AdminModel = require("../models/admin.model.js");
let UserModel = require("../models/user.model.js");

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

/*************************************** Login view rendering *****************************************************************/

router.get("/login", function (req, res, next) {
  res.render("admin/login", { title: "Express" });
});

/************************************** Login data post ***********************************************************************/

router.post("/login/post", function (req, res) {
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      console.log(user);
      if (user !== null) {
        var message = "Successfully login";
        req.session.isAdminActive = true;
        req.session.user = Username;
        customEvents.emit("login", message, user.username);
        res.redirect("/admin");
      } else {
        var message = "Invalid login";
        res.redirect(
          url.format({
            pathname: "/admin/login",
            query: message,
          })
        );
        customEvents.emit("login", message, Username);
      }
    });
  });
});

/********************************** Rendering to dashboard ********************************************************************/

router.get("/", auth.isAuthorized, function (req, res, next) {
  var message = "Dash Board Loaded";
  customEvents.emit("dashBoardLoaded", message);
  res.render("admin/dashboard", {
    menuHtml: html.getMenuHtml(),
    title: "Gretong Admin",
  });
});

/********************************** Rendering to categories Listing ********************************************************************/

router.get("/categories/", auth.isAuthorized, function (req, res, next) {
  var id = req.query.id ? req.query.id : 0;
  Categories.find({ parent_category: id }, function (err, response) {
    customEvents.emit("categoryLoaded", response);
    Response.successResponse(req);
    res.render("admin/categories_list", {
      menuHtml: html.getMenuHtml(),
      collection: response,
      title: "Categorys",
      responce: response,
      id: id,
    });
  });
});

/********************************** Edit categories action  ********************************************************************/

router.get("/category/edit", auth.isAuthorized, function (req, res, next) {
  var id = req.query.id ? req.query.id : 0;
  Categories.find({ _id: id }, function (err, response) {
    var response = response.pop();
    //console.log(response);
    res.render("admin/categories_add", {
      menuHtml: html.getMenuHtml(),
      collection: response,
      title: "Category Edit",
      postUrl: "/admin/updatecategories",
      response: response,
      id: id,
    });
  });
});

/********************************** Add categories action  ********************************************************************/

router.get(
  "/product/add/:id",
  auth.isAuthorized,
  function (request, response, next) {
    var id = request.params.id ? request.params.id : 0;

    response.render("admin/categories_add", {
      menuHtml: html.getMenuHtml(),
      title: "Categorys",
      response: response,
      postUrl: "/admin/savecategories",
      id: id,
    });
  }
);

/********************************** Update categories action  ********************************************************************/

router.post(
  "/updatecategories",
  upload.single("categories_image"),
  function (req, res, next) {
    auth.isAuthorized;
    callback();
    const id = req.body.id;
    var categories_image = req.body.categories_image;
    if (req.file != undefined) {
      var categories_image = req.file.filename;
    }

    req.checkBody("categories", "Categories Name is required").notEmpty();
    req
      .checkBody("categories_description", "Categories Description is required")
      .notEmpty();
    req
      .checkBody("categories_content", "Categories Content is not valid")
      .notEmpty();
    let errors = req.validationErrors();

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
      Categories.findByIdAndUpdate(
        req.body.id,
        objectCat,
        { upsert: true },
        function (err, num, n) {
          if (err) {
            throw err;
          } else {
            //console.log(newCategory);
            req.flash("success_msg", "You successfully Update this category");
            res.redirect("/admin/categories?id=" + objectCat.parent_id);
          }
        }
      );
    }
  }
);

/********************************** Save categories action  ********************************************************************/

router.post(
  "/savecategories",
  upload.single("categories_image"),
  function (req, res, next) {
    auth.isAuthorized;
    const id = req.body.id;
    req.checkBody("categories", "Categories Name is required").notEmpty();
    req
      .checkBody("categories_description", "Categories Description is required")
      .notEmpty();
    req
      .checkBody("categories_content", "Categories Content is not valid")
      .notEmpty();
    let errors = req.validationErrors();
    if (!req.file && !errors) {
      errors = [];
      errors.push({ msg: "Image is required filed" });
    } else if (!req.file) {
      errors.push({ msg: "Image is required filed" });
    }

    //console.log(errors);
    if (errors || !req.file.filename) {
      //console.log(req.body)
      req.flash("error_msg", errors);
      res.redirect(
        url.format({
          pathname: "/admin/categories/add/" + id,
          query: req.body,
        })
      );
    } else {
      const categories = req.body.categories;
      const categories_description = req.body.categories_description;
      const categories_content = req.body.categories_content;
      const image = req.file.filename;
      let newCategory = new Categories({
        categories: categories,
        categories_image: image,
        categories_description: categories_description,
        categories_content: categories_content,
        parent_category: id,
      });
      newCategory.save(function (err) {
        if (err) {
          return;
        } else {
          //console.log(newCategory);
          req.flash("success_msg", "You successfully save this category");
          res.redirect("/admin/categories?id=" + id);
        }
      });
    }
  }
);

/********************************** Delete categories action  ********************************************************************/

router.get("/category/delete", function (req, res) {
  var id = req.query.id ? req.query.id : 0;
  var parent_id = req.query.parent_id ? req.query.parent_id : 0;
  var objectCat = new Object();
  objectCat._id = id.trim();

  Categories.count({ parent_category: id.trim() }).then((count) => {
    customEvents.emit(
      "categoryDeleteBefore",
      "Count of child categorys" + count
    );
    if (count === 0) {
      Categories.findOneAndRemove(objectCat, function (err) {
        if (err) {
          customEvents.emit("categoryDeleteFailed", err);
          res.redirect("/admin/categories?id=" + parent_id);
        } else {
          customEvents.emit("categoryDeleted", "Category Has been Deleted");
          req.flash("success_msg", "You successfully deleted this category.");
          res.redirect("/admin/categories?id=" + parent_id);
        }
      });
    } else {
      let errors = [];

      errors.push({ msg: "Please delete child category first." });
      customEvents.emit("categoryDeleteFailed", errors);
      req.flash("error_msg", errors);
      res.redirect("/admin/categories?id=" + parent_id);
    }
  });
});

/********************************** forwarding 404 action  ********************************************************************/
app.use(function (req, res, next) {
  //next(createError(404));
  res.status(400);
  res.render("404", { title: "404: File Not Found" });
});

/********************************** logout action  ********************************************************************/

router.get("/logout/", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    customEvents.emit("logOut");
    var message = "logOut";
    res.redirect(
      url.format({
        pathname: "/admin/login",
        query: message,
      })
    );
    //return res.send({ authenticated: req.isAuthenticated() });
  });
});

module.exports = router;
