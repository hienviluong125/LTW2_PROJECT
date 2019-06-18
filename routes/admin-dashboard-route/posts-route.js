const router = require('express').Router();
const postsService = require('./../../services/postsService');
const categoriesService = require('./../../services/categoriesService');
const { } = require('./../../helpers/utils');

function redirect(req, res, flash) {
    req.flash('flash-posts', { message: flash.message, className: flash.className });
    res.redirect('/admin/posts');
}

const renderpostIndexPage = (req, res, next) => {
    postsService.getAll()
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
    res.render('admin/posts/add', { layout: 'admin/common/add_edit_post' })
}

const renderEditPostPage = (req, res, next) => {
    let slug = req.params.slug
    let WriterId = res.locals.user.id;
    Promise.all([
        postsService.get({ slug, WriterId }),
        categoriesService.getAllCategories()
    ]).then(data => {
        let post = data[0];
        let allCategories = data[1];
        if (post && allCategories) {
            if (post.status === 'verified' || post.status === 'published') {
                res.redirect('/admin/posts')
            }
            res.render('admin/posts/edit', { post, allCategories, layout: 'admin/common/add_edit_post' });
        } else {
            res.render('commons/error404');
        }
    }).catch(err => {
        res.render('commons/error404');
    })
}

const renderVerifyPostPage = (req, res, next) => {
    let prevRouter = req.headers.referer;
    let slug = req.params.slug;
    Promise.all(
        [
            categoriesService.getAllCategories(),
            postsService.get({ slug })
        ]
    ).then(rs => {
        let allCategories = rs[0];
        let post = rs[1];
        res.render('admin/posts/verify', { allCategories, post, prevRouter, layout: 'admin/common/add_edit_post' });
    }).catch(err => {
        return next();
    })
}

const renderDeletePostPage = (req, res, next) => {
    postsService.deleteById(req.params.id)
        .then(() => res.redirect('/admin/posts'))
        .catch(err => next(err));
}

const addPostHandler = (req, res, next) => {

}

const editPostHandler = (req, res, next) => {

}

const deletePostHandler = (req, res, next) => {

}

const publishPost = (req, res, next) => {
    let id = req.params.id;
    postsService.publishPost({ id })
        .then(() => res.redirect('/admin/posts'))
        .catch(err => next(err))
}



router.get('/', renderpostIndexPage);
router.get('/add', renderAddPostPage);
router.get('/edit/:slug', renderEditPostPage);
router.get('/delete/:id', renderDeletePostPage);
router.get('/publish/:id', publishPost)
router.get('/verify/:slug', renderVerifyPostPage)

router.post('/add', addPostHandler);
router.post('/edit/:id', editPostHandler);
router.post('/delete/:id', deletePostHandler);



// Ajax
// router.post('/posts/verify', verifyPost)

module.exports = router;