var P = global.$P;
var log = P.logger;
var DB = require('sequelize');

var sequelize = new DB('nbase', 'nbase', 'nbase104', {
	host: '127.0.0.1',
	dialect: 'mysql',
	pool: {
		max: 50,
		min: 0,
		idle: 10000
	}
});

var DAO = function(errHandler){
	var caller = arguments.callee.caller;
	var defaultSuccessHandler = function(result){
		if(result && P.devMode) log.info(module.id + ' --> ' + result);
	}
	var defaultErrorHandler = function(err){
		var E = new Error();
		E.name = err.name;
		E.message = err.message;
		E.index = err.original.index;
		E.errno = err.original.errno;
		E.sql = err.sql;
		E.sqlState = err.original.sqlState;
		E.stack = caller.stack;
		if(errHandler) errHandler(E);
		else throw E;
	};

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
	this.find = function(sql, params, success, error){
		Error.captureStackTrace(caller);
		sequelize.query(sql, {type:sequelize.QueryTypes.SELECT, replacements:params})
			.then(success ? success: defaultSuccessHandler)
			.catch(error ? error : defaultErrorHandler);
	};

	this.insert = function(sql, params, success, error){
		Error.captureStackTrace(caller);
		sequelize.query(sql, {type:sequelize.QueryTypes.INSERT, replacements:params})
			.then(success ? success: defaultSuccessHandler)
			.catch(error ? error : defaultErrorHandler);
	};

	this.update = function(sql, params, success, error){
		Error.captureStackTrace(caller);
		sequelize.query(sql, {type:sequelize.QueryTypes.BULKUPDATE, replacements:params})
			.then(success ? success: defaultSuccessHandler)
			.catch(error ? error : defaultErrorHandler);
	};

	this.delete = function(sql, params, success, error){
		Error.captureStackTrace(caller);
		sequelize.query(sql, {type:sequelize.QueryTypes.BULKDELETE, replacements:params})
			.then(success ? success: defaultSuccessHandler)
			.catch(error ? error : defaultErrorHandler);
	};

	// sqls: [
	//	[sql0, param0-0, param0-1, ...],
	//	[sql1, param1-0, param1-1, ...],
	//	[...], ...
	// ]
	this.transaction = function(sqls, success, error){
		Error.captureStackTrace(caller);
		sequelize.transaction({
				//isolationLevel:Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
				//autoCommit:false
			}, function(t){ return _transaction(sqls, t);})
			.then(success ? success : defaultSuccessHandler)		// auto commit
			.catch(error ? error : defaultErrorHandler);			// auto rollback
	};
}

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

module.exports = DAO;
module.exports.core = sequelize;
