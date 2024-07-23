//Modules
var express = require("express");
var modulePath = require("./../../../config.js").modulePath();
const jwt = require("jsonwebtoken");
const _mongodb = require(modulePath+"/security/helper/database.js");
const customEvents = require(modulePath+"/utility/helper/custom-events");
const auth = require(modulePath+"/middleware/helper/auth_api.js");
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
      console.log(user);
      if (user !== null) {
        var message = "Successfully login";
        customEvents.emit("login", message, user.username);
        // Then generate JWT Token

        let jwtSecretKey = process.env.JWT_SECRET_KEY || responseSecret.JWT_SECRET_KEY;

        let data = {
          time: Date(),
          userId: user._id,
        };
        console.log({ ok1: data });
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
