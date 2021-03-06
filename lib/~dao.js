var P = global.$p;
var log = P.logger;
var DB = require('sequelize');

var dao = {};
var sequelize = new DB('nbase', 'nbase', 'nbase104', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 50,
		min: 0,
		idle: 10000
	}
});

/*
  { SELECT: 'SELECT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  BULKUPDATE: 'BULKUPDATE',
  BULKDELETE: 'BULKDELETE',
  DELETE: 'DELETE',
  UPSERT: 'UPSERT',
  VERSION: 'VERSION',
  SHOWTABLES: 'SHOWTABLES',
  SHOWINDEXES: 'SHOWINDEXES',
  DESCRIBE: 'DESCRIBE',
  RAW: 'RAW',
  FOREIGNKEYS: 'FOREIGNKEYS' }
 */

dao.find = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.SELECT, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

dao.insert = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.INSERT, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

dao.update = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.UPDATE, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

dao.bulkUpdate = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.BULKUPDATE, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

dao.delete = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.DELETE, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

dao.bulkDelete = function(sql, params, success, failure){
	sequelize.query(sql, {type:sequelize.QueryTypes.BULKDELETE, replacements:params})
		.then(success ? success: function(result){ log.info(result); })
		.catch(failure ? failure : function(err){ log.error(err.message, err); });
};

// sqls: [
//	[sql0, param0-0, param0-1, ...],
//	[sql1, param1-0, param1-1, ...],
//	[...], ...
// ]
dao.transaction = function(sqls, success, failure){
	sequelize.transaction({
		//isolationLevel:Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
		//autoCommit:false
	}, function(t){
		return _transaction(sqls, t);
	}).then(success ? success : function(result){			// auto commit
		log.info('transaction done, result: ' + result);
	}).catch(failure ? failure : function(err){				// auto rollback
		log.error(err.message, err);
	});
};

var _transaction = function(sqls, t){
	var params = sqls.shift();
	var sql = '';
	if(typeOf(params) === 'array') sql = params.shift().trim();
	else{
		sql = params.trim();
		params = '';
	}
	if(sql.length == 0) return;
	return sequelize.query(sql, {transaction:t, replacements:params}).then(function(result){
		if(sqls.length > 0) return _transaction(sqls, t);
	});
}

module.exports = dao;
