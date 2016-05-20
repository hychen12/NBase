var checker = function(req, res, next){
	var flag = true;
	if(flag) next();
	else res.redirect('/');
}

module.exports = checker;
