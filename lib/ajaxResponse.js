var msg = {
	200: 'OK',
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Signed Already',
	500: 'Error'
};

/*
	code:
		200: OK
		2xx: ...
		3xx: business logic fail ...
		400: Bad request (ex: param invalid)
		401: Unauthorized
		402: Signed Already
		4XX: ...
		500: Error
		5xx: ...
 */
var ajaxResponse = function(code, message, data){
	var res = {
		code: code || 200,
		message: message || msg[(code || 200)] || '',
		data: data
	};
	res.ok = res.code < 300 && res.code >= 200;
	return res;
};

module.exports = ajaxResponse;
