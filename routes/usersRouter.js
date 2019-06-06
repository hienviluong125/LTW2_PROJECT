const router = require('express').Router();
const usersService = require('./../services/usersService');
const subService = require('./../services/subscriberService');
const writerService = require('./../services/writerService');
const passport = require('passport');
const mail = require('../config/mailer');
const { htmlDateParser } = require('../helpers/utils')
const middleware = require('./../middlewares/index');

const logout = (req, res, next) => {
    req.logout();
    res.redirect('/users/login');
}

const renderLoginPage = (req, res, next) => {
    if (typeof res.locals.isLoggedIn !== 'undefined' && res.locals.isLoggedIn) {
        res.redirect('/index');
        return;
    }
    res.render('users/register', {
        layout: 'layouts/without_blocks',
        errors: req.flash('errors'),
        active: 'login',
        success: req.flash('success'),
    });
}

const renderRegisterPage = (req, res, next) => {
    res.render('users/register', {
        layout: 'layouts/without_blocks',
        active: 'register',
        danger: req.flash('danger')
    });
}

const registerAccount = async (req, res, next) => {
    let user = { email, password, repassword } = req.body;
    let type = req.body.type;
    let errors = await usersService.validateRegisterData(email, password, repassword);

    if (errors.length > 0) {
        res.render('users/register', {
            errors,
            email,
            layout: 'layouts/without_blocks',
            active: 'register'
        });
    } else {
        delete user.type;
        delete user.repassword;
        user.username = user.email;
        user.role = type;
        usersService.create(user)
            .then(user => {
                console.log("user created: ", user.email);
                let result;
                if (type == 'sub') {
                    result = subService.create(user.id, true);
                } else if (type == 'writer') {
                    result = writerService.create(user);
                }
                if (typeof result !== 'undefined') {
                    result.then(user => {
                        console.log('account type is created for userID: ', user.UserId);
                    })
                        .catch(err => next(err))
                    req.flash('success', { message: "Great, now you can log in" });
                } else {
                    req.flash('danger', { message: "Something went wrong, please try again.." });
                    res.redirect('/users/register');
                }
                res.redirect("/users/login");
            })
            .catch(err => next(err));
    }
}

const loginHandle = async (req, res, next) => {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureMessage: 'Email or password incorrect.'
    }, (error, user, info) => {
        if (error) { return next(err); }
        if (!user) {
            //set flash message here
            req.flash('errors', { message: info.message });
            return res.redirect('/users/login');
        }
        req.logIn(user, function (error) {
            if (error) { return next(error); }
            return res.redirect("/index");
        });
    })(req, res, next);
};

const renderForgotPage = (req, res, next) => {
    res.render('users/forgot', {
        layout: false,
        submitted: false,
    });
}

const forgotHandler = async (req, res, next) => {
    let email = req.body.email;
    if (usersService.isEmail(email)) {
        usersService.findOneByEmail(email)
            .then(user => {
                if (user !== null) {
                    let token = usersService.generateRecoveryPasswordToken(user);
                    //send Email to client
                    mail.sendMail(user, token);
                }
                //render notification that email is sent regardless of email is existed or not in db
                res.render('users/forgot', {
                    layout: false,
                    submitted: true,
                    email: email
                });

            })
            .catch(error => {
                next(error);
            });
    } else {
        res.render('users/forgot', {
            layout: false,
            submitted: false,
            flash: {
                msg: "Email is not valid",
                className: "warning"
            }
        });
    }
}

const renderRecoveryPasswordPage = function (req, res, next) {
    usersService.findOne(+req.params.id)
        .then(user => {
            try {
                let payload = usersService.decodeRecoveryPasswordToken(user, req.params.token);
                if (user !== null && user.id == payload.id && user.email == payload.email) {
                    res.render("users/recover", {
                        submitted: false,
                        layout: false,
                        userId: user.id,
                        email: user.email,
                        token: req.params.token,
                        flash: req.flash('invalid-new-password')
                    })
                } else {
                    next(new Error("invalid token/params"));
                }
            } catch (err) {
                next(err);
            }
        })
        .catch(err => {
            next(err);
        })
}

const recoveryPasswordHandler = (req, res, next) => {
    let data = req.body;
    console.log(data);
    if (data.password && data.password.length < 6) {
        req.flash('invalid-new-password', { className: 'warning', msg: "Password has atleast 6 characters" });
        res.redirect(`/users/reset/${data.userId}/${data.token}`);
    } else {
        usersService.findOne(data.userId).then(user => {
            if (user.email == data.email) {
                usersService.changePassword(user, data.password)
                    .then(changedRows => {
                        req.flash('success', { message: "Password changed successfully, now you can log in again" });
                        res.redirect('/users/login');
                    })
                    .catch(err => {
                        next(err);
                    })
            }
        })
            .catch(err => {
                next(err);
            })
    }
}

const renderProfilePage = (req, res, next) => {
    Promise.all([usersService.findOne(+req.params.id), writerService.findOne(+req.params.id)])
        .then(values => {
            let penName;
            if (values[1] !== null) {
                penName = values[1].PenName;
            }
            if (values[0] == null) {
                next(new Error('Can not find user'));
            } else {
                if (values[0].DoB !== null) {
                    values[0].DoB = htmlDateParser.parse(values[0].DoB);
                }
                res.render('users/profile.ejs', {
                    user: values[0],
                    penName,
                    editStatus: (res.locals.isLoggedIn && +req.params.id === +res.locals.user.id) ? '' : 'disabled',
                    flash: req.flash('update-success')
                });
            }
        })
        .catch(err => {
            next(err);
        })
}

const updateUserProfile = (req, res, next) => {
    if (res.locals.isLoggedIn && +req.params.id === + res.locals.user.id) {
        let user = req.body;
        user.DoB = new Date(req.body.DoB);
        user.id = res.locals.user.id;
        usersService.updateInfo(user)
            .then(changedRows => {
                req.flash('update-success', { message: "Update infomation successfully" });
                res.redirect(`/users/profile/${res.locals.user.id}`);
            })
            .catch(err => {
                next(err);
            })
    } else {
        req.flash('errors', { message: 'You need to log in to update your personal info.' });
        res.redirect('/users/login');
    }
}

const renderChangePasswordPage = (req, res, next) => {
    res.render('users/change-password', {
        flash: req.flash('change-password-errors')
    });
}

const changePasswordHandler = (req, res, next) => {
    let password = req.body.password, repassword = req.body.repassword;
    let errors = usersService.validateNewPasswords(password, repassword);
    if (errors.length > 0) {
        req.flash('change-password-errors', errors);
        res.redirect('/users/profile/changepassword');
    } else {
        usersService.changePassword(req.user, password)
            .then(changedRows => {
                req.flash('update-success', { message: "Update password successfully" });
                res.redirect(`/users/profile/${res.locals.user.id}`);
            })
            .catch(err => {
                next(err);
            })
    }
}



router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);
router.get('/logout', logout);
router.get('/forgot', renderForgotPage);
router.get('/reset/:id/:token', renderRecoveryPasswordPage);
router.get('/profile/changepassword', middleware.Authentication, renderChangePasswordPage);
router.get('/profile/:id',middleware.Authentication, renderProfilePage);


router.post('/register', registerAccount);
router.post('/login', loginHandle);
router.post('/forgot', forgotHandler);
router.post('/reset', recoveryPasswordHandler);
router.post('/profile/changepassword', middleware.Authentication, changePasswordHandler);
router.post('/profile/:id', middleware.Authentication, updateUserProfile);

module.exports = router;