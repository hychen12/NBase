var P = global.$P;
var log = P.logger;
var express = require('express');
var router = express.Router();
var service = require('../../lib/service.js');
var ar = require('../../lib/ajaxResponse.js');
var sign = require('../../lib/signinChecker.js');


var signed = sign.signed;
router.post('/select', function(req, res, next){setTimeout(next, 500)}, signed, function(user, req, res, next) {
	service.find(req.body.sql, [], function(result){
		res.json(ar(200, '', result));
	}, next);
});

router.post('/insert', signed, function(user, req, res, next){
	service.insert(req.body.sql, [], function(result){
		res.json(ar(200, '', result));
	}, next);
});

router.post('/update', signed, function(user, req, res, next){
	service.update(req.body.sql, [], function(result){
		res.json(ar(200, '', result));
	}, next);
});

router.post('/delete', signed, function(user, req, res, next){
	service.delete(req.body.sql, [], function(result){
		res.json(ar(200, '', result));
	}, next);
});

router.post('/transaction', signed, function(user, req, res, next){
	service.transaction(req.body.sql.split(';'), function(result){
		res.json(ar(200, '', result));
	}, next);
});





router.use(function(err, req, res, next){
	log.error(err);
	res.json(ar(500, P.devMode ? ('<<Dev Mode>> {' + err.message + '}') : '此操作發生問題!'));
});

module.exports = router;