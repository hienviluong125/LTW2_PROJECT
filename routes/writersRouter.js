const router = require('express').Router();

const renderPostListPage = (req, res, next) => {
    res.render('writers/posts/list');
}

const renderAddPostPage = (req, res, next) => {
    res.render('writers/posts/add');
}

const renderEditPostPage = (req, res, next) => {
    res.render('writers/posts/edit');
}



router.get('/posts', renderPostListPage);
router.get('/posts/add', renderAddPostPage);
router.get('/posts/edit', renderEditPostPage);

module.exports = router;