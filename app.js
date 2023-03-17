/**** SetUp Start ****/

/*************************************************** All Required Pack *********************************************************/
require("./config/database.js");
var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var expressValidator = require("express-validator");
var port = process.env.PORT || 5006;

var mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");

var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
///var MongoDBStore = require('connect-mongodb-session')(session);

var common = require("./middleware/middleware_frontend.js");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");
var registerRouter = require("./routes/register");
var adminRouter = require("./routes/admin");
// configuration ===============================================================
// set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs"); // set up ejs for templating
// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));
//Validation
app.use(expressValidator());

/*var store = new MongoDBStore({
 uri: 'mongodb://localhost:27017/greatcart',
 collection: 'mySessions'
 });*/

// Catch errors
/*store.on('error', function(error) {
 assert.ifError(error);
 assert.ok(false);
 });*/
//required for passport
app.use(
  session({
    secret: "ilovescotchscotchyscotchscotch", // session secret
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: true,
    //store: store,
    saveUninitialized: true,
  })
);

const MongoDbStore = require("connect-mongodb-session")(session);

// Passport Config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use(flash()); // use connect-flash for flash messages stored in session
//Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// launch ======================================================================
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(400);
  res.render("404", { title: "404: File Not Found" });
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Middleware function to log request protocol
app.use("/admin", function (req, res, next) {
  console.log("A request for things received at " + Date.now());
  next();
});
app.listen(port);
console.log("The magic happens on port " + port);
module.exports = app;
