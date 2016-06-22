require('mootools');
var ar = require('./ajaxResponse.js');
var redis = require('redis').createClient();

var P = global.$P;
var log = P.logger;

var sign = {
	// for action, if user does not sign, redirect to sign page (/)
	check: function(req, res, next){
		var key = 'session:' + req.session.id + ':user';
		_check(key,
			function(user){
				redis.expire(key, P.signinLatency.user);
				next(user);
			},
			function(){res.redirect('/');}, next);
	},

	// for action, if user signed, redirect to default page (/user/showcase)
	redirect: function(req, res, next){
		var key = 'session:' + req.session.id + ':user';
		_check(key, function(user){res.redirect('/user/showcase');}, next, next);
	},

	// for ajax, if user does not sign, response error code(401:Unauthorized)
	signed: function(req, res, next){
		var key = 'session:' + req.session.id + ':user';
		_check(key, next, function(){res.json(ar(401))}, next);
	},

	// for ajax, if user signed, response error code(402:Signed Already)
	unsign: function(req, res, next){
		var key = 'session:' + req.session.id + ':user';
		_check(key, function(user){res.json(ar(402))}, next, next);
	}
};

var _check = function(key, found, notFound, failure){
	redis.get(key, function(err, reply){
		if(err) return failure(err);

		if(reply) found(JSON.decode(reply));
		else notFound();
	});
}


module.exports = sign;


