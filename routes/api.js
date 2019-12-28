// wiki.js - Wiki route module.
var express = require('express')
var request = require("request");

var router = express.Router();

// Home page route.
router.get('/', function(req, res) {
	var options = {
		method: 'POST',
	    url: 'http://m2.dev.com/index.php/rest/V1/integration/admin/token',
	    headers: {
			'content-type': 'application/json'
		},
	    body:'{"username":"apiaccess","password":"api@12345"}'
	};
	request(options, function (error, response, body) {
	    if (error) throw new Error(error);
	     res.send("Magento access token for api =>>>> "+body);
	});
})

// About page route.
router.get('/about', function(req, res) {
    res.send('About this wiki');
})

module.exports = router;
