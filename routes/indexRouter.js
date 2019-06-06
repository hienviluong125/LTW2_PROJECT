const router = require('express').Router();
const postsService = require('./../services/postsService');
const {parseVIDate} = require('./../helpers/utils');

const renderIndexPage = (req, res, next) => {
    Promise.all([
        postsService.noticeablePosts(),
        postsService.mostViewsPosts(),
        postsService.latestPosts(),
        postsService.newPostByHotCats()
    ])
    .then(result => {
        // console.log("==============DATA=============");
        // console.log(result);
        // console.log("=============DATA================");
        let data = {
            noticeablePosts: result[0],
            mostViewsPosts: result[1],
            latestPosts: result[2],
            newPostByHotCats: result[3],
            parseVIDate
        };
        // res.json(data.newPostByHotCats)
        res.render('commons/index',data)
    })
    .catch(err => {
        return next(err);
    })
}

const renderAboutPage = (req, res, next) => {
    res.render('commons/about');
}

const redirectToIndexPage = (req, res, next) => {
    res.redirect('/index')
   
}

const renderErrorPage = (req,res,next) => {
    res.render('commons/error404');
}

router.get('/', redirectToIndexPage);
router.get('/index', renderIndexPage);
router.get('/about', renderAboutPage);
router.get('/error',renderErrorPage);


module.exports = router;