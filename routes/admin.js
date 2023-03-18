const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const url = require("url");
const mongoosePaginate = require("mongoose-paginate-v2");

const session = require("express-session");
const auth = require("../middleware/auth_backend");
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
      //console.log(user);
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
