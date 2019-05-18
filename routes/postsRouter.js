const router = require('express').Router();
const mockPost = require('./../mocks/post.index');
const postsService = require('./../services/postsService');
const { createPagesArr } = require('./../helpers/utils');


const renderAllPosts = (req, res, next) => {
    const { topPosts, hotTags } = mockPost;
    let { tag, maincate, subcate, page } = req.params;
    let limit = 8;
    let offset = limit * (page - 1);

    postsService
        .getAllPosts({ offset, limit, tag, maincate, subcate })
        .then(result => {
            let { data } = result;
            let { posts, count } = data;
            let pagination = createPagesArr(page, count, limit);
            res.render('posts/index', { posts, page, pagination, topPosts, hotTags });
        })
        .catch(err => next(err));
}

const renderDetailPost = (req, res, next) => {
    let slug = req.params.slug;
    const { topPosts, hotTags } = mockPost;
    postsService
        .get({ slug })
        .then(post => {
            res.render('posts/detail', { post, topPosts, hotTags });
        })
        .catch(err => next(err));
}


router.get('/detail/:slug', renderDetailPost)
router.get('/tags/:tag/:page', renderAllPosts)
router.get('/:maincate/:page', renderAllPosts)
router.get('/:maincate/:subcate/:page', renderAllPosts)


router.get('/', (req, res, next) => res.redirect('/posts/all/1'))


module.exports = router;