var P = global.$P;
var log = P.logger;
var DAO = require('../lib/dao.js');
var r = require("redis"), redis = r.createClient();
var RS = require('redis-scheduler');
var rs = new RS({host: 'localhost', port: 6379 });


var service = {};

service.signIn = function(signer, success, failure, errHandler){
	var dao = new DAO(errHandler);
	dao.find('select id, sign_id, name from User where sign_id=? and password=? and enable=?', [signer.id, signer.pwd, true], function(result){
		if(!result || !result[0]) return failure('sign in failure');
		var user = result[0];

		dao.insert('insert into user_log(adm_id, session_id, ip, signin_date) values(?, ?, ?, ?)', [user.id, signer.sid, signer.ip, new Date()], function(logId){
			var key = 'session:' + signer.sid + ':user';
			user.logId = logId;
			redis.set(key, JSON.encode(user), 'EX', P.signinLatency.user, 'NX', function(err, reply){
				if(err) return errHandler(err);

				rs.schedule({
					key: key,
					handler: function(err, key){
						dao.update('update admin_log set signout_date=? where id=?', [new Date(), logId], function(){
							if(P.devMode) log.info('Admin(' + user.sign_id + ') auto sign out due expired! (logId:' + logId + ')');
						}, function(){});
					}
				});

				success(user);
				if(P.devMode) log.info('Admin(' + user.sign_id + ') sign in!');
			});
		});
	});
};

service.signOut = function(user, success, errHandler){
	var dao = new DAO(errHandler, new Error());
	var key = 'session:' + user.sid + ':user';
	redis.del(key, function(err, reply){
		if(err) return errHandler(err);
		if(reply === 1) dao.update('update user_log set signout_date=? where id=?', [new Date(), user.logId], success);
	});
};


service.find = function(sql, params, success, error){
	var dao = new DAO(error);
	dao.find(sql, params, success);
};

service.insert = function(sql, params, success, error){
	var dao = new DAO(error);
	dao.insert(sql, params, success);
};

service.update = function(sql, params, success, error){
	var dao = new DAO(error);
	dao.update(sql, params, success);
};

service.delete = function(sql, params, success, error){
	var dao = new DAO(error);
	dao.delete(sql, params, success);
};

service.transaction = function(sqls, success, error){
	var dao = new DAO(error);
	dao.transaction(sqls, success);
};


module.exports = service;
