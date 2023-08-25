const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Bring in User Model
let User = require("../models/user.model");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("customer/views/register", { title: "Express" });
});
// Register Proccess
router.post("/register", function (req, res, next) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const username = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  req.checkBody("firstname", "First Name is required").notEmpty();
  req.checkBody("lastname", "Last Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);
  let errors = req.validationErrors();
  if (errors) {
    req.flash("error_msg", errors);
    res.redirect("/register");
  } else {
    let newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: username,
      password: password,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }

        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            return;
          } else {
            console.log(newUser);
            req.flash("success_msg", "You are now registered and can log in");
            res.redirect("/register");
          }
        });
      });
    });
  }
});
// Login Process
router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/register",
    failureFlash: true,
  })(req, res, next);
});
// logout
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "You are logged out");
  res.redirect("/users/login");
});
module.exports = router;
