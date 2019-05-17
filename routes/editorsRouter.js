const router = require('express').Router();
const postsService = require('./../services/postsService');
const categoriesService = require('./../services/categoriesService');
const middleware = require('./../middlewares/users/local-auth');
const { getPostStatusColor,createPagesArr } = require('./../helpers/utils');

const renderPosts = (req, res, next) => {
    let subCateSlug = req.params.cate;
    let page = req.params.page;
    let limit = 8;
    let offset = limit * (page - 1);
    let EditorId = res.locals.user.id;
    Promise.all(
        [
            categoriesService.getAllSubCategoriesOfEditor({ EditorId }),
            postsService.getAllPostManagedByEditor({ SubCate: subCateSlug, EditorId, limit, offset })
        ]
    ).then(rs => {
        let SubCategories = rs[0];
        let { posts, SubCategory,count } = rs[1];
        let pagination = createPagesArr(page, count, limit);
        let currentSubCate = SubCategories.find(sub => sub.slug === subCateSlug);
        currentSubCate = typeof currentSubCate === 'undefined' ? 'all' : currentSubCate.name;
        res.render('editors/posts/index', { currentSubCate, SubCategories, posts, subCateSlug,SubCategory, getPostStatusColor,pagination,page });
    }).catch(err => {
        return next();
    })

    // }
};

const rejectPost = (req, res, next) => {
    let prevRouter = req.headers.referer;
    let { PostId, NoteContent, WriterId } = req.body;
    let EditorId = res.locals.user.id;

    postsService
        .rejectPost({ PostId, NoteContent, EditorId, WriterId })
        .then(() => {
            res.redirect(prevRouter);
        }).catch(err => {
            //chuyển trang thường và alert
        })
}

const renderVerifyPost = (req, res, next) => {
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
        res.render('editors/posts/verify', { allCategories, post, prevRouter });
    }).catch(err => {
        return next();
    })
}

const verifyPost = (req, res, next) => {
    let EditorId = res.locals.user.id;
    let { WriterId, releaseDate, tags, PostId, SubCategoryId, MainCategoryId, prevRouter } = req.body;
    let str_date = releaseDate.split('/');
    let day = parseInt(str_date[1]),
        month = parseInt(str_date[0]) - 1,
        year = parseInt(str_date[2]);
    releaseDate = new Date(year, month, day);
    //
    postsService
        .verifyPost({ WriterId, EditorId, releaseDate, tags, PostId, SubCategoryId, MainCategoryId, prevRouter })
        .then(result => {
            if (result.status) {
                return res.status(200).json({ data: result.data })
            } else {
                return res.status(500).json({ err: result.data });
            }

        }).catch(err => {
            return res.status(500).json({ err });
        })

}


router.all(
    '*',
    middleware.Authorization(['editor'])
);

router.post('/posts/reject', rejectPost)
router.get('/posts/verify/:slug', renderVerifyPost)
router.post('/posts/verify', verifyPost)
router.get('/posts/:cate/:page', renderPosts);



module.exports = router;