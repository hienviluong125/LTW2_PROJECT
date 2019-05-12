const router = require('express').Router();
const upload = require('./../helpers/uploader');
const postsService = require('./../services/postsService');
const categoriesSerivce = require('./../services/categoriesService');

const renderPostListPage = (req, res, next) => {
    let page = req.params.page;
    let id = req.user.id;
    postsService
        .getAllPostByUserId({ id })
        .then(posts => {
            // res.json({posts});
            res.render('writers/posts', { posts });
        })
        .catch(err => {
            res.json({ err });
        })

}



const renderAddPostPage = (req, res, next) => {
    categoriesSerivce
        .getAllCategories()
        .then(allCategories => {
            res.render('writers/posts/add', { allCategories });
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
            res.status(404).json("vcl");
        }

    })

}

const addPost = (req, res, next) => {
    //sẽ thay thế là authorization middleware sau
    if (!req.user) {
        res.status(500).json({ err: "please login" });
    } else {

        let param = JSON.parse(req.body.data);
        console.log(param);
        param.WriterId = req.user.id;
        postsService
            .add(param)
            .then(result => {
                res.status(200).json({ result });
            })
            .catch(err => {
                res.status(500).json({ err });
            })
    }
}

const editPost = (req, res, next) => {
    if (!req.user) {
        res.status(500).json({ err: "please login" });
    } else {
        let param = JSON.parse(req.body.data);


        param.WriterId = req.user.id;
        postsService
            .edit(param)
            .then(result => {
                res.status(200).json({ result });
            })
            .catch(err => {
                res.status(500).json({ err });
            })
    }
}

const deletePost = (req, res, next) => {
    if (!req.user) {
        res.status(500).json({ err: "please login" });
    } else {
        let slug = req.params.slug;
        let WriterId = req.user.id;
        postsService
            ._delete({ slug, WriterId })
            .then(() => {
                res.redirect('/writers/posts');
            })
            .catch(err => {
                res.status(500).json({ err });
            })
    }
}



router.get('/posts/add', renderAddPostPage);
router.get('/posts/edit/:slug', renderEditPostPage);
router.get('/posts/delete/:slug', deletePost);

router.get('/posts', (req, res, next) => res.redirect('/writers/posts/1'));
router.get('/posts/:page', renderPostListPage);

router.post('/posts/add', upload.array('images'), addPost);
router.post('/posts/edit', upload.array('images'), editPost);

module.exports = router;