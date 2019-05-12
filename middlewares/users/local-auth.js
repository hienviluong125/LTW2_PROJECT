function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('errors', {message: 'Please log in.'});
        res.redirect('/users/login');
    }
}

function registerStatus(req, res, next){
	if(typeof res.locals.isLoggedIn === 'undefined' || res.locals.isLoggedIn === false){
		res.locals.isLoggedIn = (req.isAuthenticated()) ? true : false;
	}
    if(res.locals.isLoggedIn && typeof res.locals.user === 'undefined'){
        res.locals.user = req.user;
    }
    next();
}

module.exports = {
    ensureAuthenticated,
    registerStatus
}