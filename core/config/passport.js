const express = require("express");
const app = require('../../app_config.js');
// Paths
const modulesPath = app.locals.modulesPath;

const LocalStrategy = require('passport-local').Strategy;
const User = require(modulesPath+"/customer/models/user.model");
const config = require('./database.js');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(username, password, done){
    // Match Username
    let query = {username:username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){    

        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){ 
          console.log('verified');
          return done(null, user);
        } else {
          console.log('Wrong password');

          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
