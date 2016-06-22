var P = global.$P;
var log = P.logger;
var express = require('express');
var router = express.Router();
var service = require('../../lib/service.js');
var ar = require('../../lib/ajaxResponse.js');
var sign = require('../../lib/signinChecker.js');


router.post('/signTemp1', function(req, res, next){setTimeout(next, 200);}, sign.unsign, function(req, res, next){
	var signer = {
		id: 'mllee',
		pwd: '123456',
		sid: req.session.id,
		ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
	};
	service.signIn(signer,
		function(){res.json(ar());},
		function(message){res.json(ar(300, message));},
		next);
});

var signed = sign.signed;
router.post('/signout', function(req, res, next){setTimeout(next, 300);}, signed, function(user, req, res, next){
	user.sid = req.session.id;
	service.signOut(user, function(result){
		req.session = null;
		res.json(ar());
	}, next);
});


router.use(function(err, req, res, next){
	log.error(err);
	res.json(ar(500, P.devMode ? ('<<Dev Mode>> {' + err.message + '}') : '此操作發生問題!'));
});

module.exports = router;