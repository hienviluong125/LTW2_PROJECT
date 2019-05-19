const router = require('express').Router();
const postService = require('./../../services/postsService');

function redirect(req, res, flash) {
    req.flash('flash-posts', { message: flash.message, className: flash.className });
    res.redirect('/admin/posts');
}

const renderpostIndexPage = (req, res, next) => {
    postService.getAll()
    .then(posts => {
        res.render('admin/posts/index',{
            posts
        })
    })
    .catch(err =>{
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

router.get('/', renderpostIndexPage);
router.get('/add', renderAddPostPage);
router.get('/edit/:id', renderEditPostPage);
router.get('/delete/:id', renderDeletePostPage);

router.post('/add', addPostHandler);
router.post('/edit/:id', editPostHandler);
router.post('/delete/:id', deletePostHandler);

module.exports = router;