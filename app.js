/************ SetUp Start ************/

// Required Packages
const express = require("express");
const app = require('./app_config.js');
const path = require("path");
const dotenv = require('dotenv').config();
const expressValidator = require("express-validator");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

// Paths
const modulesPath = app.locals.modulesPath;
const corePath = app.locals.corePath;

// Middleware
const common = require(corePath + "/middleware/middleware_frontend.js");

// Routers
const indexRouter = require(modulesPath + "/frontend/routes/index");
const usersRouter = require(modulesPath + "/customer/routes/users");
const apiRouter = require(modulesPath + "/rest/routes/api");
const registerRouter = require(modulesPath + "/customer/routes/register");
const adminRouter = require(modulesPath + "/admin/routes/admin");
const productRouter = require(modulesPath + "/product/routes/product");
const categoryRouter = require(modulesPath + "/category/routes/category");
const quizRouter = require(modulesPath + "/quiz/routes/quiz");

// Configuration
app.set("view engine", "ejs");
app.set('views', modulesPath + '/');
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressValidator());

// Session Setup
app.use(session({
  secret: "ilovescotchscotchyscotchscotch",
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  resave: true,
  saveUninitialized: true,
  store: new MongoDbStore({
    uri: 'mongodb://localhost:27017/greatcart',
    collection: 'mySessions'
  })
}));

// Passport Setup
require(corePath + "/config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/rest/api", apiRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);
app.use("/admin/product", productRouter);
app.use("/admin/category", categoryRouter);
app.use("/admin/quiz", quizRouter);

// Error Handlers
app.use(function (req, res, next) {
  res.status(404);
  res.render("frontend/views/404", { title: "404: File Not Found" });
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("frontend/views/error");
});

// Middleware to log request protocol
app.use("/admin", function (req, res, next) {
  console.log("A request for things received at " + Date.now());
  next();
});

// Start Server
const port = process.env.PORT || 5007;
app.listen(port, () => {
  console.log("The magic happens on port " + port);
});

module.exports = app;
