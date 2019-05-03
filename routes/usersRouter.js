const router = require('express').Router();
const usersService = require('./../services/usersService');
const subService = require('./../services/subscriberService');
const writerService = require('./../services/writerService');
const passport = require('passport');


const logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}

const renderLoginPage = (req,res,next) => {
    res.render('users/register', { 
        layout: 'layouts/without_blocks',
        errors: req.flash('errors'),
        active: 'login',
        success: req.flash('success'),
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
    let type = req.body.type;
    let errors = await usersService.validateRegisterData(email, password, repassword, next);
    
    if(errors.length > 0){
        res.render('users/register', {
            errors,
            email, 
            layout: 'layouts/without_blocks',
            active: 'register'
        });
    }else{
        delete user.type;
        delete user.repassword;
        user.username = user.email;
        user.role = type;
        usersService.create(user)
            .then(user => {
                console.log("user created: ", user.password);
                
                    let result;
                    if(type == 'sub'){
                        result = subService.create(user.id);
                    }else if(type == 'writer'){
                        result = writerService.create(user);
                    }
                    result.then(user => {
                        console.log('account type is created for userID: ', user.UserId);
                    })
                    .catch(err => next(err))
                req.flash('success', {message: "Great, now you can log in"});
                res.redirect("/users/login");
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

const renderForgotPage = (req, res, next) => {
    res.render('users/forgot', {
        layout: false
    });
}

router.get('/register',renderRegisterPage);
router.get('/login',renderLoginPage);
router.post('/register', registerAccount);
router.post('/login', loginHandle);
router.get('/logout', logout);
router.get('/forgot', renderForgotPage);
module.exports = router;