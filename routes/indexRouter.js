const router = require('express').Router();

const renderIndexPage = (req, res, next) => {
    res.render('commons/index');
}

const renderAboutPage = (req, res, next) => {
    res.render('commons/about');
}

const redirectToIndexPage = (req, res, next) => {
    //Index page
    // Hiển thị 4 bài viết nổi bật nhất trong tuần qua
    // Hiển thị 10 bài viết được xem nhiều nhất (mọi chuyên mục)
    // Hiển thị 10 bài viết mới nhất (mọi chuyên mục)
    // Hiển thị top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
    res.redirect('/index');
}

const renderErrorPage = (req,res,next) => {
    res.render('commons/error404');
}

router.get('/', redirectToIndexPage);
router.get('/index', renderIndexPage);
router.get('/about', renderAboutPage);
router.get('/error',renderErrorPage);


module.exports = router;