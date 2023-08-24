// wiki.js - Wiki route module.
var express = require('express')
var request = require("request");

var router = express.Router();
let baseUrlLocal = "http://mage.local";
let baseUrlRest = "http://mage.local/rest/V1";
let baseUrlDev = "http://mage.local/rest/V1";
// Home page route.
router.get('/', function(req, res) {
	var options = {
		method: 'POST',
	    url: baseUrlLocal+"/index.php/rest/V1/integration/admin/token",
	    headers: {
			'content-type': 'application/json'
		},
	    body:'{"username":"admin","password":"$7!Mtk$G5e8%"}'
	};
	request(options, function (error, response, body) {
	    if (error) throw new Error(error);
	     res.send("Magento access token for api =>>>> "+body);
	});
})

router.get('/search', function(req, res) {
	   var options = {
		method: 'GET',
		url: baseUrlDev+"/wcbsearchautocomplete/search?q=vijak&store_id=1&customer_id=1&group=21&page=1"
	};
	request(options, function (error, response, body) {
		if (error) throw new Error(error);
		res.send("Search Result =>>>> "+body);
	});
})

// About page route.
router.get('/about', function(req, res) {
    res.send('About this wiki');
})

module.exports = router;
