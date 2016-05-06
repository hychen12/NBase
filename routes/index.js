var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index/_', {layout: '_layout/default'});
});

/*
router.get('/xxx', function (req, res, next) {
	res.render('xxx/_', {
		layout: 'layout_yyy',
		variable: 'value'
	});
});
*/

module.exports = router;
