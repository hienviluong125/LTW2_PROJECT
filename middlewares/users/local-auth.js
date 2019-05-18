function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('errors', { message: 'Please log in.' });
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



function Authorization(roles) {
    return (req, res, next) => {
        // return next();
        if (res.locals.user && typeof res.locals.user !== 'undefined') {
            if (roles.includes(res.locals.user.role)) {
                return next();
            } else {
                return res.render('commons/error404',{error: 'Bạn không đủ quyền để truy cập trang này !!!'});
            }
        }
        req.flash('errors', { message: 'Please log in.' });
        res.redirect('/users/login');
    }
}



module.exports = {
    ensureAuthenticated,
    registerStatus,
    Authorization,
}