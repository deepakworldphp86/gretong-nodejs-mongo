const app = require("../../../appConfig.js");
const corePath = app.locals.corePath;
const layoutBackendPath = app.locals.layoutBackendPath;

const jwt = require('jsonwebtoken');
const url = require('url');
const html = require(corePath + "/utility/adminMenuHtml");
const adminCustomEvents = require(corePath + "/utility/adminCustomEvents");
const _mongodb = require(corePath + "/config/database.js");
const allowedLoggedInDuration = (process.env.ALLOWED_LOGGED_IN_DURATION || 1800) * 1000;

const getLoginView = (req, res, next) => {
  if (req.session.isAdminActive === undefined || req.session.isAdminActive === false) {
    res.render("admin/views/login", { title: "Express" });
  } else {
    res.render("admin/views/dashboard", {
      menuHtml: html.getMenuHtml(),
      title: "Gretong Admin",
      layoutBackendPath: layoutBackendPath,
    });
  }
};

const postLoginData = (req, res) => {
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      if (user !== null) {
        var message = "Successfully login";
        req.session.isAdminActive = true;
        req.session.user = Username;
        adminCustomEvents.emit("login", message, user.username);

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
        adminCustomEvents.emit("login", message, Username);
      }
    });
  });
};

const getDashboard = (req, res) => {
  console.log('TOTAL DURATION',allowedLoggedInDuration);

  var message = "Dash Board Loaded";
  adminCustomEvents.emit("dashBoardLoaded", message);
  res.render("admin/views/dashboard", {
    menuHtml: html.getMenuHtml(),
    layoutBackendPath: layoutBackendPath,
    title: "Gretong Admin",
  });
};

const getLogout = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    adminCustomEvents.emit("logOut");
    var message = "logOut";
    res.redirect(
      url.format({
        pathname: "/admin/login",
        query: message,
      })
    );
  });
};

module.exports = {
  getLoginView,
  postLoginData,
  getDashboard,
  getLogout,
};
