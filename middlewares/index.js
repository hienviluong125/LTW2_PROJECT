const Authentication = (req, res, next) => {
    if (req.user && typeof req.user !== 'undefined') {
        next();
    } else {
        res.redirect('/users/login');
    }
}


const Authorization = (roles) => {
        return (req, res, next) => {
        next();
    }
}







module.exports = {
    Authentication,
    Authorization
}