const router = require('express').Router();
const postsService = require('./../services/postsService');
const cateogoriesService = require('./../services/categoriesService');
const middleware = require('./../middlewares/index');

const renderPosts = (req, res, next) => {
    let subCateSlug = req.params.cate;
    let page = req.params.page;
    let limit = 8;
    let offset = limit * (page - 1);
    Promise.all(
        [
            cateogoriesService.getAllSubCategoriesOfEditor({ EditorId: req.user.id }),
            postsService.getAllPostManagedByEditor({ SubCate: subCateSlug, EditorId: req.user.id, limit, offset })
        ]
    ).then(rs => {
        let SubCategories = rs[0];
        let { posts, SubCategory } = rs[1];
        let currentSubCate = SubCategories.find(sub => sub.slug === subCateSlug);
        console.log("===============");
        console.log("currentSubCate", currentSubCate);
        console.log("===============");
        currentSubCate = typeof currentSubCate === 'undefined' ? 'all' : currentSubCate.name;
        res.render('editors/posts/index', { currentSubCate, SubCategories, posts, SubCategory });
    }).catch(err => {
        return next();
    })

    // }
};


router.get('/posts/:cate/:page', middleware.Authentication, renderPosts);

module.exports = router;