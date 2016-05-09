var dao = {};
var sequelize = new Sequelize('m031001', 'root', 'hychen123', {
	host: 'localhost',
	dialect: 'mysql',
	pool: {
		max: 50,
		min: 0,
		idle: 10000
	}
});

dao._subTransaction = function(sql, param, t) {
	return sequelize.query(sql,{transaction:t, replacements:param}).then(
		function() {
			if (this.count < this.size) {
				var sql = this.sqlArray[this.count][0];
				var param = this.sqlArray[this.count][1];
				this.count++;

				return this._subTransaction(sql, param, t);
			}
			else {
				console.log('no more sql');
			}
		}.bind(this)
	);
};

dao.transaction = function(sqls, next){ //sqls: [[sql, param0, param1, ...], [...], ...]
	sequelize.transaction({
		//isolationLevel:Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
		//autoCommit:false
	}, function(t){
		var sql = this.sqlArray[this.count][0];
		var param = this.sqlArray[this.count][1];
		this.count++;
		return this._subTransaction(sql, param, t);
	}.bind(this)).then(function(result){
		console.log(result);
		//auto commit here
		next(null, 'insert ok');
	}).catch(function(err){
		//rollback here
		console.log(err);
		next(err);
	});
};

module.exports = dao;
