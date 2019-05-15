const Authentication = (req, res, next) => {
    if (req.user && typeof req.user !== 'undefined') {
        next();
    } else {
        res.redirect('/users/login');
    }
}


const Authorization = (roles) => {
    return (req, res, next) => {
        if(req.user && typeof req.user !== 'undefined'){
            if(roles.includes(req.user.role)){
                return next();
            }else{
                return res.json({"msg":"Chuyển trang error"});
            }
        }
        return res.json({"msg":"Chuyển trang error 22"});
    }
}







module.exports = {
    Authentication,
    Authorization
}