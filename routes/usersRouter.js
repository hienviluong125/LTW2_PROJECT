const router = require('express').Router();
const usersService = require('./../services/usersService');

const renderLoginPage = (req, res, next) => {
    res.render('users/login', { 'layout': 'layouts/without_blocks' });
}

const renderRegisterPage = (req, res, next) => {
    res.render('users/register', { 'layout': 'layouts/without_blocks' });
}


router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);


module.exports = router;