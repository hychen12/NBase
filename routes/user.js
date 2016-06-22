require('mootools');
var express = require('express');
var router = express.Router();
var sign = require('../lib/signinChecker.js');

var check = sign.check;
var options = {
	layout: 'user',
	devMode: global.$P.devMode
};
router.get('/showcase', check, function(user, req, res, next){
	res.render('user/$showcase/$', Object.merge({
		isShowcase: true,
		user: user
	}, options));
});

router.get('/dev', check, function(user, req, res, next){
	res.render('user/$dev/$', Object.merge({
		isDev: true,
		user: user
	}, options))
});
router.use('/dev.ajax', require('../routes/user.ajax/dev.js'));

router.get('/', function(req, res, next){
	res.redirect('user/showcase');
});

module.exports = router;
