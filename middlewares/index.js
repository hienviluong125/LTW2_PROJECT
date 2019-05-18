const Authentication = (req, res, next) => {
    if (res.locals.user && typeof res.locals.user !== 'undefined') {
        next();
    } else {
        res.redirect('/users/login');
    }
}


function Authorization(roles) {
    return (req, res, next) => {
        // return next();
        if (res.locals.user && typeof res.locals.user !== 'undefined') {
            if (roles.includes(res.locals.user.role)) {
                return next();
            } else {
                return res.render('commons/error404', { error: 'Bạn không đủ quyền để truy cập trang này !!!' });
            }
        }
        req.flash('errors', { message: 'Please log in.' });
        res.redirect('/users/login');
    }
}







module.exports = {
    Authentication,
    Authorization
}