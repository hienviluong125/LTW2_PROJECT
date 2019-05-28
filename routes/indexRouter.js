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
    //Index page
    // Hiển thị 4 bài viết nổi bật nhất trong tuần qua
    // Hiển thị 10 bài viết được xem nhiều nhất (mọi chuyên mục)
    // Hiển thị 10 bài viết mới nhất (mọi chuyên mục)
    // Hiển thị top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
    Promise.all([
        postsService.noticeablePosts,
        postsService.mostViewsPosts,
        postsService.latestPosts,
        postsService.newPostByHotCats
    ])
    .then(result => {
        console.log({result});
        let data = {
            noticeablePosts: result[0],
            mostViewsPosts: result[1],
            latestPosts: result[2],
            newPostByHotCats: result[3]
        };
        res.json({data})
    })
    .catch(err => {
        return next(err);
    })
   
}

const renderErrorPage = (req,res,next) => {
    res.render('commons/error404');
}

router.get('/', redirectToIndexPage);
router.get('/index', renderIndexPage);
router.get('/about', renderAboutPage);
router.get('/error',renderErrorPage);


module.exports = router;