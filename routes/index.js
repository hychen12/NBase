var express = require('express');
var router = express.Router();
var sign = require('../lib/signinChecker.js');


router.get('/', sign.redirect, function(req, res, next) {
	res.render('$index/$', {
		layout: 'default',
		devMode: global.$P.devMode
	});
});

module.exports = router;
