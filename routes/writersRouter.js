const router = require('express').Router();
const upload = require('./../helpers/uploader');
const postsService = require('./../services/postsService');
const categoriesSerivce = require('./../services/categoriesService');
const middleware = require('./../middlewares/users/local-auth');
const { getPostStatusColor, createPagesArr } = require('./../helpers/utils');

const renderPostListPage = (req, res, next) => {
    let status = req.params.status;
    let page = req.params.page;
    let limit = 8;
    let offset = limit * (page - 1);

    let id = res.locals.user.id;
    postsService
        .getAllPostByUserId({ id, limit, offset, status })
        .then(result => {
            let { data } = result;
            let { posts, count } = data;
            let pagination = createPagesArr(page, count, limit);

            res.render('writers/posts', { posts, page, getPostStatusColor, status, pagination });
        })
        .catch(err => {
            console.log(err);
            res.render('commons/error404');
        })

}

const renderAddPostPage = (req, res, next) => {
    categoriesSerivce
        .getAllCategories()
        .then(allCategories => {
            res.render('writers/posts/add', { allCategories });
        })
        .catch(err => {
            res.render('commons/error404');
        })
}

const renderEditPostPage = (req, res, next) => {
    let slug = req.params.slug
    let WriterId = 2;
    Promise.all([
        postsService.get({ slug, WriterId }),
        categoriesSerivce.getAllCategories()
    ]).then(data => {
        let post = data[0];
        let allCategories = data[1];
        if (post && allCategories) {
            res.render('writers/posts/edit', { post, allCategories });
        } else {
            res.render('commons/error404');
        }
    }).catch(err => {
        res.render('commons/error404');
    })

}

const addPost = (req, res, next) => {
    //sẽ thay thế là authorization middleware sau
    let param = JSON.parse(req.body.data);
    param.WriterId = res.locals.user.id;
    postsService
        .add(param)
        .then(result => {
            if (result.status) {
                res.status(200).json({ data: result.data });
            } else {
                res.status(500).json({ err: result.err });
            }

        })
        .catch(err => {
            res.status(500).json({ err });
        })

}

const editPost = (req, res, next) => {
    let param = JSON.parse(req.body.data);
    param.WriterId = res.locals.user.id;
    postsService
        .edit(param)
        .then(result => {
            if (result.status) {
                res.status(200).json({ data: result.data });
            } else {
                res.status(500).json({ err: result.err });
            }
        })
        .catch(err => {
            res.status(500).json({ err: err });
        })
}

const deletePost = (req, res, next) => {

    let slug = req.params.slug;
    let WriterId = res.locals.user.id;
    postsService
        ._delete({ slug, WriterId })
        .then(() => {
            res.redirect('/writers/posts');
        })
        .catch(err => {
            res.render('commons/error404');
        })

}

router.all(
    '*',
    middleware.Authorization(['writer'])
);

router.get('/posts/add', renderAddPostPage);
router.get('/posts/edit/:slug', renderEditPostPage);
router.get('/posts/delete/:slug', deletePost);

router.get('/posts', (req, res, next) => res.redirect('/writers/posts/all/1'));
router.get('/posts/:status/:page', renderPostListPage);

router.post('/posts/add', upload.array('images'), addPost);
router.post('/posts/edit', upload.array('images'), editPost);

module.exports = router;