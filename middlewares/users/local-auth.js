function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('errors', {message: 'Please log in.'});
        res.redirect('/users/login');
    }
}

function status(req, res, next){
    req.locals.isLoggedIn = (req.isAuthenticated()) ? true : false;
    if(req.locals.isLoggedIn){
        req.locals.user = req.user;
    }
    console.log("info:", req.locals.user);
    next();
}

module.exports = {
    ensureAuthenticated,
    status
}