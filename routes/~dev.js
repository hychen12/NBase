var express = require('express');
var router = express.Router();
var dao = require('../lib/dao.js');


router.use(require('../lib/loginChecker.js'));

router.get('/', function (req, res, next) {
	res.render('dev/_', {layout: '_layout/default'});
});

router.get('/*', function (req, res, next) {
	res.render('dev' + req.path + '/_', {layout: '_layout/default'});
});

router.post('/db/ajax/select', function(req, res, next){setTimeout(next, 1000)}, function (req, res, next) {
	var sql = req.body.sql;
	dao.find(sql, [],
		function(result){ res.json(result); },
		function(error){ res.status(500).end(error.message); });
});

router.post('/db/ajax/insert', function (req, res, next) {
	var sql = req.body.sql;
	dao.insert(sql, [],
		function(result){ res.json(result); },
		function(error){ res.status(500).end(error.message); });
});

router.post('/db/ajax/update', function (req, res, next) {
	var sql = req.body.sql;
	var bulk = req.body.bulk;
	dao[bulk ? 'bulkUpdate' : 'update'](sql, [],
		function(result){ res.json(result); },
		function(error){ res.status(500).end(error.message); });
});

router.post('/db/ajax/delete', function (req, res, next) {
	var sql = req.body.sql;
	var bulk = req.body.bulk;
	dao[bulk ? 'bulkDelete' : 'delete'](sql, [],
		function(result){ res.json(result); },
		function(error){ res.status(500).end(error.message); });
});

router.post('/db/ajax/transaction', function (req, res, next) {
	var sqls = req.body.sql.split(';');
	dao.transaction(sqls,
		function(result){ res.json('Done!'); },
		function(error){ res.status(500).end(error.message); });
});

module.exports = router;
