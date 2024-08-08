//Modules
const express = require("express");
const app = require('../../../app_config');

// Paths
const modulesPath = app.locals.modulesPath;
const corePath = app.locals.corePath;


const jwt = require("jsonwebtoken");
const _mongodb = require(corePath+"/config/database.js");
const customEvents = require(corePath+"/utility/custom-events");
const auth = require(corePath+"/middleware/auth_api.js");
var router = express.Router();

//Temp
router.post("/token", (req, res, next) => {
  // Validate User Here
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  var responseSecret = auth.getSecretKey();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      if (user !== null) {
        var message = "Successfully login";
        customEvents.emit("login", message, user.username);
        // Then generate JWT Token

        let jwtSecretKey = process.env.JWT_SECRET_KEY || responseSecret.JWT_SECRET_KEY;

        let data = {
          time: Date(),
          userId: user._id,
        };
        const token = jwt.sign(data, jwtSecretKey,{ expiresIn: '1800s'});
        var tokenResponse = { token: token };
        res.status(200).send(tokenResponse);
      } else {
        customEvents.emit("login", message, Username);
        var response = { message: "Invalid login" };
        res.status(401).send(response);
      }
    });
  });
});

router.get("/test", auth.validateJwtToken,(req, res, next) => {

  res.status(200).send('OK...GATE OPEN');

});

module.exports = router;
