const router = require('express').Router();
const usersService = require('./../services/usersService');
const passport = require('passport');
const renderLoginPage = (req,res,next) => {
    res.render('users/register', { 
        layout: 'layouts/without_blocks',
        errors: req.flash('errors'),
        active: 'login'
    });
}

const renderRegisterPage = (req,res,next) => {
    res.render('users/register', {
        layout: 'layouts/without_blocks',
        active: 'register'
    });
}

const registerAccount = async (req, res, next) => {
    let user = {email, password, repassword} = req.body;

    let errors = await usersService.validateRegisterData(email, password, repassword, next);
    
    if(errors.length > 0){
        res.render('users/register', {
            errors,
            email, 
            layout: 'layouts/without_blocks',
            active: 'register'
        });
    }else{
        delete user.repassword;
        user.username = user.email;
        usersService.create(user)
            .then(user => {
                console.log("user created: ", user.password);
                //create session

                //redirect to main paged
                res.end("created, redirecting to main page...");
            })
            .catch(err => next(err)); 
    }
}

const loginHandle = async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureMessage: 'Email or password incorrect.'
    },(error, user, info) => {
            if (error) { return next(err); }
            if (!user) { 
                //set flash message here
                req.flash('errors', {message: info.message});
                return res.redirect('/users/login'); 
            }
            req.logIn(user, function (error) {
                if (error) { return next(error); }
                return res.end(req.user.password);
            });
    })(req, res, next);
};


router.get('/register',renderRegisterPage);
router.get('/login',renderLoginPage);
router.post('/register', registerAccount);
router.post('/login', loginHandle);
module.exports = router;