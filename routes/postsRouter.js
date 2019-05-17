const router = require('express').Router();
const mockPost = require('./../mocks/post.index');
const postsService = require('./../services/postsService');



const renderIndexPage = (req, res, next) => {
    const { topPosts, hotTags } = mockPost;
    postsService
        .getAllPosts()
        .then(result => {
            let { data } = result;
            let { posts } = data;
            res.render('posts/index', { posts, topPosts, hotTags });
        })
        .catch(err => next(err));

}

router.get('/', renderIndexPage);


module.exports = router;