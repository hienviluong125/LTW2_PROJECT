const router = require('express').Router();
const usersService = require('./../services/usersService');
const middlewares = require('./../middlewares/index');


const renderLoginPage = (req, res, next) => {
    res.render('users/login');
}

const renderRegisterPage = (req, res, next) => {
    res.render('users/register');
}


router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);


module.exports = router;