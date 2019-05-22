const router = require('express').Router();
const mockPost = require('./../mocks/post.index');
const postsService = require('./../services/postsService');
const { createPagesArr } = require('./../helpers/utils');
const subService = require('./../services/subscriberService');

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
            res.render('posts/index', { posts, page, pagination, topPosts, hotTags, tag, maincate, subcate });
        })
        .catch(err => next(err));
}

const renderDetailPost = (req, res, next) => {
    let slug = req.params.slug;
    const { topPosts, hotTags } = mockPost;
    Promise.all([
        postsService.getDetailPost({ slug }),
        subService.isPremium(+req.user.id),
    ])
    .then(data => {
        // res.json(post);
        res.render('posts/detail', { post: data[0], topPosts, hotTags, isPremium: data[1] });
    })
    .catch(err => next(err));

}

const addComment = (req, res, next) => {
    let { PostId, commentContent } = req.body;
    let UserId = res.locals.user.id;
    let UserName = res.locals.user.username;
    postsService
        .addCommentToPost({ PostId, commentContent, UserId })
        .then(result => {
            res.status(200).json({ ...result.dataValues, UserName });
        })
        .catch((err) => res.status(500).json({ err }))

}

const loadMoreComment = (req, res, next) => {
    let { PostId, offset } = req.body;
    limit = 5;
    postsService
        .loadMoreComment({ PostId, offset,limit })
        .then(result => res.json(result))
}


const exportPostAsPdf = async (req, res, next) => {
    try{
        let post = await postsService.get({slug: req.params.slug});
        //console.log("DATA: ", JSON.parse(post.dataValues.content));
        subService.exportPdf(res, JSON.parse(post.dataValues.content), post.dataValues.slug)
    }catch(err){
        next(err);
    } 
}
router.get('/exports/:slug', exportPostAsPdf)
router.get('/detail/:slug', renderDetailPost)
router.get('/tags/:tag/:page', renderAllPosts)
router.get('/:maincate/:page', renderAllPosts)
router.get('/:maincate/:subcate/:page', renderAllPosts)

router.get('/', (req, res, next) => res.redirect('/posts/all/1'))

// Ajax
router.post('/comment', addComment)
router.post('/comment/loadmore', loadMoreComment)
// Ajax

module.exports = router;