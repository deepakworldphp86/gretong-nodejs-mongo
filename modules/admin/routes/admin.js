const express = require("express");
var app = require('../../../app_config.js');
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const layoutBackendPath = app.locals.layoutBackendPath;

const router = express.Router();
var path = require("path");


const multer = require("multer");

const url = require("url");
const mongoosePaginate = require("mongoose-paginate-v2");
const jwt = require("jsonwebtoken");
const mBackend = require(corePath+"/middleware/helper/middleware_backend.js");

const session = require("express-session");
const auth = require(corePath+"/middleware/helper/middleware_backend.js");
const config = require(corePath+"/utility/helper/config-array");
const html = require(corePath+"/utility/helper/dynamic-html");
const Response = require(corePath+"/utility/helper/response");
const customEvents = require(corePath+"/utility/helper/custom-events");
const async = require("async");


const _mongodb = require(corePath+"/security/helper/database.js");
/*************************** Model *********************************/
let CategoriesModel = require(modulesPath+"/category/models/categories.model.js");
let AdminModel = require(modulesPath+"/admin/models/admin.model.js");
let UserModel = require(modulesPath+"/customer/models/user.model.js");

/************************** Upload Config *************************/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicPath+"/admin/uploads");
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
  if(req.session.isAdminActive === undefined){
     res.render("admin/views/login", { title: "Express" });
  }else{

    res.render("admin/views/dashboard", {
      menuHtml: html.getMenuHtml(),
      title: "Gretong Admin",
      layoutBackendPath :layoutBackendPath
    });
  }
});

/************************************** Login data post ***********************************************************************/

router.post("/login/post", function (req, res) {
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      //console.log(user);
      if (user !== null) {
        var message = "Successfully login";
        req.session.isAdminActive = true;
        req.session.user = Username;
        customEvents.emit("login", message, user.username);

        //JWT auth
        let jwtSecretKey = process.env.JWT_SECRET_KEY || responseSecret.JWT_SECRET_KEY;

        let data = {
          time: Date(),
          userId: user._id,
        };
        var token = jwt.sign(data, jwtSecretKey,{ expiresIn: '1800s'});
        
        req.session.jwtToken = token;

        //Success Redirect
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
  res.render("admin/views/dashboard", {
    menuHtml: html.getMenuHtml(),
    layoutBackendPath :layoutBackendPath,
    title: "Gretong Admin",
  });
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
