const router = require('express').Router();

const renderIndexPage = (req, res, next) => {
    res.render('commons/index');
}

const renderAboutPage = (req, res, next) => {
    res.render('commons/about');
}

const redirectToIndexPage = (req, res, next) => {
    res.redirect('/index');
}

router.get('/', redirectToIndexPage);
router.get('/index', renderIndexPage);
router.get('/about', renderAboutPage);


module.exports = router;