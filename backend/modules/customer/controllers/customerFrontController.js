// controllers/customerController.js
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/customerModel");

// GET home page
exports.getHomePage = (req, res) => {
  res.render("customer/views/register", { title: "Express" });
};

// Register Process
exports.registerUser = (req, res) => {
  const { firstname, lastname, email, password, password2 } = req.body;
  req.checkBody("firstname", "First Name is required").notEmpty();
  req.checkBody("lastname", "Last Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();
  req.checkBody("password2", "Passwords do not match").equals(password);

  let errors = req.validationErrors();
  if (errors) {
    req.flash("errorMsg", errors);
    return res.redirect("/register");
  }

  let newUser = new User({
    firstname,
    lastname,
    email,
    username: email,
    password
  });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;

      newUser.password = hash;
      newUser.save(err => {
        if (err) throw err;
        req.flash("successMsg", "You are now registered and can log in");
        res.redirect("/register");
      });
    });
  });
};

// Login Process
exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true,
  })(req, res, next);
};

// Logout Process
exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("successMsg", "You are logged out");
  res.redirect("/register");
};
