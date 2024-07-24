    var express = require('express');
    var router = express.Router();

    /* GET users listing. */
    router.get('/', function (req, res, next) {
        res.send('respond with a resource');
    });

// logout
    router.get('/logout', function (req, res) {
        req.logout();
        req.flash('successMsg', 'You are logged out');
        res.redirect('/register');
    });


   module.exports = router;
