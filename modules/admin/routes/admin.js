// Required modules and configurations
const express = require("express");
const app = require("../../../app_config.js");
const corePath = app.locals.corePath;
const modulesPath = app.locals.modulesPath;
const publicPath = app.locals.publicPath;
const layoutBackendPath = app.locals.layoutBackendPath;
const allowedLoggedInDuration = (process.env.ALLOWED_LOGGED_IN_DURATION || 1800) * 1000; // Default to 30 minutes
const router = express.Router();
const path = require("path");
const multer = require("multer");
const url = require("url");
const session = require("express-session");
const mongoosePaginate = require("mongoose-paginate-v2");
const jwt = require("jsonwebtoken");
const mBackend = require(corePath + "/middleware/middleware_backend.js");
const auth = require(corePath + "/middleware/middleware_backend.js");
const config = require(corePath + "/utility/config-array");
const html = require(corePath + "/utility/backend-menu-html");
const Response = require(corePath + "/utility/response");
const customEvents = require(corePath + "/utility/custom-events");
const async = require("async");
const _mongodb = require(corePath + "/config/database.js");

// Models
const CategoriesModel = require(modulesPath + "/category/models/category.model.js");
const AdminModel = require(modulesPath + "/admin/models/admin.model.js");
const UserModel = require(modulesPath + "/customer/models/customer.model.js");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, publicPath + "/admin/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

// Express session configuration
router.use(
  session({
    secret: "ilovebeer",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: true,
    saveUninitialized: true,
  })
);

// Promises and asynchronous operations
const loginPromise = new Promise(function (resolve, reject) {
  // Promise logic
});

// Routes

// Login view rendering
router.get("/login", function (req, res, next) {
  if (req.session.isAdminActive === undefined || req.session.isAdminActive === false) {
    res.render("admin/views/login", { title: "Express" });
  } else {
    res.render("admin/views/dashboard", {
      menuHtml: html.getMenuHtml(),
      title: "Gretong Admin",
      layoutBackendPath: layoutBackendPath,
    });
  }
});

// Login data post
router.post("/login/post", function (req, res) {
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      if (user !== null) {
        var message = "Successfully login";
        req.session.isAdminActive = true;
        req.session.user = Username;
        customEvents.emit("login", message, user.username);

        // JWT auth
        let jwtSecretKey = process.env.JWT_SECRET_KEY || responseSecret.JWT_SECRET_KEY;

        let data = {
          time: Date(),
          userId: user._id,
        };
        var token = jwt.sign(data, jwtSecretKey, { expiresIn: allowedLoggedInDuration });

        req.session.jwtToken = token;

        // Success Redirect
        res.redirect("/admin");
      } else {
        var message = "Invalid username or password";
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

// Rendering to dashboard
router.get("/", auth.isAuthorized, function (req, res, next) {
  console.log('TOTAL DURATION',allowedLoggedInDuration);

  var message = "Dash Board Loaded";
  customEvents.emit("dashBoardLoaded", message);
  res.render("admin/views/dashboard", {
    menuHtml: html.getMenuHtml(),
    layoutBackendPath: layoutBackendPath,
    title: "Gretong Admin",
  });
});

// Logout action
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
  });
});

// Export the router
module.exports = router;
