var express = require("express");

/*****************JWT TOEKN CONFIG *****************/
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/secretKeyGenerator.js");
const config = require("../config/config.js");

dotenv.config();

/*****************JWT TOKEN CONFIG END *************/

module.exports = {
  validateJwtToken: function (req, res, next) {
    try {
      const token =
        req.body.token ||
        req.query.token ||
        req.headers["authorization"].split(" ")[1];
      let jwtSecretKey = process.env.JWT_SECRET_KEY;

      if (token !== undefined || token !== "") {
        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
          next();
        }
      } else {
        // Access Denied
        return res.status(401).send(error);
      }
    } catch (error) {
      // Access Denied
      return res.status(401).send(error);
    }
  },
  getSecretKey: function () {
    //JWT Token
    var responseSecret = {};
    console.log(process.env);
    if (process.env.JWT_SECRET_KEY == undefined) {
      var JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || secretKey.getToken();
      responseSecret.JWT_SECRET_KEY = JWT_SECRET_KEY;
    } else {
      responseSecret.JWT_SECRET_KEY = config.JWT_SECRET_KEY;
    }

    return responseSecret;
  },
};
