const router = require('express').Router();
const mockPost = require('./../mocks/post.index');



const renderIndexPage = (req, res, next) => {
    const { posts, topPosts, hotTags } = mockPost;
    res.render('posts/index', { posts, topPosts, hotTags });
}



router.get('/', renderIndexPage);


module.exports = router;