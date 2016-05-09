'use strict'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/_layout');

var P = global.$p;
var log = P.logger;

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
log.info('[' + P.name + '] view engine established. (by handlebars)');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(accessLogger());
log.info('[' + P.name + '] http access logger established. (by morgan)');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*** routing ***/
app.use('/', require('./routes/index'));
//app.use('/users', require('./routes/users'));


// default page (index.htm)
var options = {
	root: __dirname + '/public/',
	dotfiles: 'deny',
	headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
	}
};
app.get('/', function(req, res){ res.sendFile('index.htm', options); });
app.get('/*', function(req, res){ res.sendFile(req.path + '/index.htm', options); });


// 404
app.use(function (req, res, next) {
	res.status(404);
	res.render('404/_', {layout: '_layout/error'});
});

// 500 etc.
app.use(function (err, req, res, next) {
	log.error(err.stack);

	res.status(err.status || 500);
	res.render('500/_', {
		error: P.devMode ? err : {},
		layout: '_layout/error'
	});
});

log.info('[' + P.name + '] App level loading completed!');
module.exports = app;


function accessLogger(){
	if(P.devMode) return morgan('dev');

	var logStream = require('file-stream-rotator').getStream({
		filename: P.logPath + '/' + P.name + '-access-%DATE%.log',
		frequency: 'daily',
		verbose: false,
		date_format: 'YYYY-MM-DD'
	});
	return morgan('combined', {stream: logStream});
}