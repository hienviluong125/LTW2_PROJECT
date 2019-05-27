const router = require('express').Router();
const postService = require('./../../services/postsService');
const { } = require('./../../helpers/utils');

function redirect(req, res, flash) {
    req.flash('flash-posts', { message: flash.message, className: flash.className });
    res.redirect('/admin/posts');
}

const renderpostIndexPage = (req, res, next) => {
    postService.getAll()
        .then(posts => {
            res.render('admin/posts/index', {
                posts,
                layout: 'admin/common/main'
            })
        })
        .catch(err => {
            next(err);
        })
}

const renderAddPostPage = (req, res, next) => {

}

const renderEditPostPage = (req, res, next) => {

}

const renderDeletePostPage = (req, res, next) => {

}

const addPostHandler = (req, res, next) => {

}

const editPostHandler = (req, res, next) => {

}

const deletePostHandler = (req, res, next) => {

}

const publishPost = (req, res, next) => {
    let id = req.params.id;
    postService.publishPost({ id })
        .then(() => res.redirect('/admin/posts'))
        .catch(err => next(err))
}

router.get('/', renderpostIndexPage);
router.get('/add', renderAddPostPage);
router.get('/edit/:id', renderEditPostPage);
router.get('/delete/:id', renderDeletePostPage);
router.get('/publish/:id', publishPost)

router.post('/add', addPostHandler);
router.post('/edit/:id', editPostHandler);
router.post('/delete/:id', deletePostHandler);

module.exports = router;