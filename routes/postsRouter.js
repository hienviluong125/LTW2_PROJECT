const router = require('express').Router();
const mockPost = require('./../mocks/post.index');
const postsService = require('./../services/postsService');
const { createPagesArr } = require('./../helpers/utils');


const renderAllPosts = (req, res, next) => {
    const { topPosts, hotTags } = mockPost;
    let page = req.params.page;
    let limit = 8;
    let offset = limit * (page - 1);

    postsService
        .getAllPosts({ offset, limit })
        .then(result => {
            let { data } = result;
            let { posts, count } = data;
            let pagination = createPagesArr(page, count, limit);
            res.render('posts/index', { posts, pagination, page, topPosts, hotTags });
        })
        .catch(err => next(err));
}

const renderPostsOfMaincate = (req,res,next) => {

}

const renderPostsOfSubcate = (req,res,next) => {

}

const renderPostsOfTag = (req,res,next) => {

}



const renderPostsWith = (type) => {
    return (req, res, next) => {
        if (type === 'all') {
            return renderAllPosts(req, res, next)
        }
        else if (type === 'maincate') {
            //maincate
            return renderAllPosts(req, res, next)
        } else if (type === 'subcate') {
            //maincate subcate
            return renderAllPosts(req, res, next)

        } else {
            //tag
            return renderAllPosts(req, res, next)
        }
    }

}

// router.get('/tags/:slug/:page',)
// router.get('/:maincate')
// router.get('/:maincate/:subcate/:page')
router.get('/all/:page', renderPostsWith('all'));


module.exports = router;