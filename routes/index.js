var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index/_', {layout: '_layout/default'});
});

module.exports = router;
