module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()){
            return next();
        }else {
            req.flash('errors', {message: 'Please log in.'});
            res.redirect('/users/login');
        }
    }
}