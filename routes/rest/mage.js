// wiki.js - Wiki route module.
var express = require("express");
var request = require("request");

/*****************JWT TOEKN CONFIG *****************/
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
JWT_SECRET_KEY = gfg_jwt_secret_key;
TOKEN_HEADER_KEY = gfg_token_header_key;

/*****************JWT TOKEN CONFIG END *************/

// Set up Global configuration access

var router = express.Router();
let baseUrlLocal = "http://mage.local";
let baseUrlRest = "http://mage.local/rest/V1";
let baseUrlDev = "http://mage.local/rest/V1";
// Home page route.
router.get("/", function (req, res) {
  var options = {
    method: "POST",
    url: baseUrlLocal + "/index.php/rest/V1/integration/admin/token",
    headers: {
      "content-type": "application/json",
    },
    body: '{"username":"admin","password":"$7!Mtk$G5e8%"}',
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.send("Magento access token for api =>>>> " + body);
  });
});

router.get("/search", function (req, res) {
  var options = {
    method: "GET",
    url:
      baseUrlDev +
      "/wcbsearchautocomplete/search?q=vijak&store_id=1&customer_id=1&group=21&page=1",
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.send("Search Result =>>>> " + body);
  });
});

// About page route.
router.get("/about", function (req, res) {
  res.send("About this wiki");
});

/********************************************Get JWT TOKEN **********************************************/

app.post("/token", (req, res, next) => {
  // Validate User Here
  var Username = String(req.body.Username).trim();
  var Password = String(req.body.Password).trim();
  _mongodb().then((db) => {
    var query = { username: Username, password: Password };
    db.collection("admin").findOne(query, function (err, user) {
      //console.log(user);
      if (user !== null) {
        var message = "Successfully login";
        customEvents.emit("login", message, user.username);
        // Then generate JWT Token
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
          time: Date(),
          userId: 12,
        };
        const token = jwt.sign(data, jwtSecretKey);
        res.status(200).send(token);
      } else {
        var message = "Invalid login";
        customEvents.emit("login", message, Username);
		res.status(401).send(err);
      }
    });
  });
});

module.exports = router;
