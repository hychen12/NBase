'use strict'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars  = require('express-handlebars');
var helpers = require('handlebars-helpers')();
var hbs = handlebars.create({
	helpers: helpers,
	extname: '.hbs',
	layoutsDir: 'views/_layout',
	partialsDir: ['views/_layout', 'views/user']
});

var P = global.$P;
var log = P.logger;

var app = express();
var app = express();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
log.info('[' + P.name + '] view engine established. (by handlebars)');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(accessLogger());
log.info('[' + P.name + '] http access logger established. (by morgan)');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// SESSION: use 'express-session'
/*var session = require('express-session');
 var uuid = require('uuid');
 app.use(session({
 genid: function(req) {
 return uuid.v4();
 },
 resave: false,
 saveUninitialized: true,
 secret: 'ysp',
 cookie: {
 secure: true,
 maxAge: 86400000
 }
 }))*/

// SESSION: use 'cookie-session'
app.use(require('cookie-session')({
	keys: ['nbase', 'ehrms2.0'],
	maxAge: 86400000
}));
var uuid = require('uuid');
app.use(function(req, res, next){
	var session = req.session;
	if(session.isNew){
		session.id = uuid.v4();
		if(P.devMode) log.info('new session created: ' + session.id);
	}
	next();
});

/*** routing ***/
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/index'));
app.use('/.ajax', require('./routes/user.ajax/common'));


// default page (index.htm)
/*
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
*/


// 404
app.use(function(req, res, next){
	res.status(404);
	res.render('_code/$404', {layout: 'error'});
});

// 500 etc.
app.use(function(err, req, res, next){
	log.error(err.stack);

	res.status(err.status || 500);
	res.render('_code/$500', {
		error: P.devMode ? err : {},
		layout: 'error'
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