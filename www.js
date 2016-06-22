'use strict'

require('mootools');
var sys = require('./package.json').sys;
var fs = require('fs');

var P = initProperties(sys);
var log = initLogger(sys);
var str = ' {\n';
Object.each(P, function(item, key){
	str += '\t' + key + ': ' + item + ', \n';
});
str += '}';
log.info('[' + P.name + '] 建立全域變數:' + str);

log.info('[' + P.name + '] 準備用 "' + P.env + '" 模式啟動 ...');
var app = require('./NBase');

// http server ...
if(sys.http){
	var server = require('http').createServer(app);
	var port = sys.http.port || 80;
	server.listen(port, function(){
		log.info('[HTTP server] 建立完成 http://127.0.0.1:' + port + '/');
	});
	server.on('error', function(err){
		log.error('[' + P.name + ':HTTP server]' + err.stack);
	});
}

// https server (SSL) ...
if(sys.https){
	P.logger.warn('[TODO] !!! HTTPS server尚未實作，之後必須補齊 !!! ... (by mllee)');

	/* TODO
	 var privateKey  = fs.readFileSync(sys.https.keyFile, 'utf8') || '';
	 var certificate = fs.readFileSync(sys.https.certFile, 'utf8') || '';
	 var credentials = {key: privateKey, cert: certificate};
	 var httpsServer = require('https').createServer(credentials, app);
	 var port = sys.http.port || 443;
	 httpsServer.listen(port, function(){
	 logger.info('[' + P.name + ':HTTPS server] listening on port: ' + port);
	 });
	 httpsServer.on('error', function(err){
	 errLogger.error('[' + P.name + ':HTTPS server]' + err.stack);
	 });*/
}

function initProperties(sys){
	// 初始化系統等級的global資訊，並存於變數 "global.$P" 中 ...
	var P = global.$P = {};		// production info!
	P.name = sys.name;
	P.env = sys.env === 'dev' ? 'dev' : 'pro';
	P.devMode = (P.env === 'dev');
	P.signinLatency = sys.signinLatency;
	return P;
}

function initLogger(sys){
	// 使用log4js建立log機制
	var logDirectory = sys.logDirectory || (__dirname + '/../log');
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
	P.logPath = logDirectory;
	var _layout = {
		type: 'pattern',
		pattern: '%[[%d] %p(%c) {%x{code}} -%]\t%m',
		tokens: {
			code: function(){
				return (new Error).stack.split('\n')[10].replace(/^\s+at\s+(\S+)\s\((.+?)([^\/]+):(\d+):\d+\)$/, function(){
					return arguments[2] + arguments[3] + ':' + arguments[4];
				});
			}
		}
	};
	var appenders = P.devMode ? [{
		type: 'console',
		layout: _layout
	}] : [{
		type: 'dateFile',
		filename: logDirectory + '/' + P.name + '-all',
		pattern: '-yyyy-MM-dd.log',
		//maxLogSize: 10485760, // for type: 'file'
		alwaysIncludePattern: true,
		catagory: 'all'
	}, {
		type: 'dateFile',
		filename: logDirectory + '/' + P.name + '-error',
		pattern: '-yyyy-MM-dd.log',
		alwaysIncludePattern: true,
		category: 'error',
		layout: _layout
	}];
	var log4js = require('log4js');
	log4js.configure({ appenders: appenders });
	var log = P.logger = {};
	log.info = log4js.getLogger('all').info.bind(log4js.getLogger('all'));
	log.error = log4js.getLogger('error').error.bind(log4js.getLogger('error'));
	return log;
}