function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else {
        req.flash('errors', {message: 'Please log in.'});
        res.redirect('/users/login');
    }
}

function status(req, res, next){
    res.locals.isLoggedIn = (req.isAuthenticated()) ? true : false;
    if(res.locals.isLoggedIn){
        res.locals.user = req.user.dataValues;
        //console.log("info:", res.locals.user);
    }
    next();
}

module.exports = {
    ensureAuthenticated,
    status
}