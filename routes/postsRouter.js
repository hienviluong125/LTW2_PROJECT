const router = require('express').Router();
const mockPost = require('./../mocks/post.index');
const postsService = require('./../services/postsService');
const { createPagesArr, highlightSearchText, parseVIDate } = require('./../helpers/utils');
const {convert} =require('./../helpers/delta-to-html');
const subService = require('./../services/subscriberService');

const renderAllPosts = (req, res, next) => {
    const { topPosts, hotTags } = mockPost;
    let { tag, maincate, subcate, page } = req.params;
    let limit = 8;
    let offset = limit * (page - 1);

    Promise.all([
        postsService.getAllPosts({ offset, limit, tag, maincate, subcate }),
        postsService.latestPosts(),
        postsService.mostViewsPosts()
    ])
        .then(result => {
            let { data } = result[0];
            let { posts, count } = data;
            
            let latestPosts = result[1];
            let mostViewsPosts = result[2];
            let pagination = createPagesArr(page, count, limit);
            res.render('posts/index', { posts, page, pagination, topPosts, hotTags, tag, maincate, subcate, latestPosts, mostViewsPosts, parseVIDate });
        })
        .catch(err => next(err));
}

const renderDetailPost = (req, res, next) => {
    let slug = req.params.slug;
    const { topPosts, hotTags } = mockPost;
    if (req.user) {
        Promise.all([
            postsService.getDetailPost({ slug }),
            subService.isPremium(+req.user.id),
            postsService.latestPosts(),
            postsService.mostViewsPosts(),
            postsService.geRandomPostsWithSameCategory({ slug,limit: 10 }),
            postsService.getRandomPosts({ slug, limit: 10 })
        ])
            .then(result => {
                let post = result[0];
                post.content = convert(JSON.parse(result[0].content)).replace(/assets/g,'/assets');
                let isPremium = result[1];
                let latestPosts = result[2];
                let mostViewsPosts = result[3];
                let randomPostsWithSameCategory = result[4];
                let randomPosts = result[5];

                if(post.isPremium){
                    if(isPremium){
                        res.json("ok mày là vip");
                        //được dzô
                    }else{
                        res.json("not vip");
                        //redirect
                    }
                }

                res.render('posts/detail', { post, topPosts, hotTags, isPremium, latestPosts, mostViewsPosts, parseVIDate, randomPostsWithSameCategory, randomPosts });
            })
            .catch(err => next(err));
    } else {
        Promise.all([
            postsService.getDetailPost({ slug }),
            postsService.latestPosts(),
            postsService.mostViewsPosts(),
            postsService.geRandomPostsWithSameCategory({ slug, limit: 10 }),
            postsService.getRandomPosts({ slug, limit: 10 })
            //subService.isPremium(+req.user.id),
        ])
        // /assets/img/posts/dung-thu-tinh-nang-quay-phim-dual-view-tren-huawei-p30-pro-0.jpeg
            .then(result => {
                let post = result[0];
                post.content = convert(JSON.parse(result[0].content)).replace(/assets/g,'/assets');
               
                let isPremium = false;
                let latestPosts = result[1];
                let mostViewsPosts = result[2];
                let randomPostsWithSameCategory = result[3];
                let randomPosts = result[4];

                if(post.isPremium){
                    if(res.locals.user === '' || !res.locals.user || typeof res.locals.user === 'undefined'){
                        res.json("dăng nhập");
                        //redirect
                    }
                }

                res.render('posts/detail', { post, topPosts, hotTags, isPremium, latestPosts, mostViewsPosts, parseVIDate, randomPostsWithSameCategory, randomPosts });
            })
            .catch(err => next(err));
    }
}

const addComment = (req, res, next) => {
    let { PostId, commentContent } = req.body;
    let UserId = res.locals.user.id;
    let UserName = res.locals.user.username;
    postsService
        .addCommentToPost({ PostId, commentContent, UserId })
        .then(result => {
            res.status(200).json({ ...result.dataValues, UserName });
        })
        .catch((err) => res.status(500).json({ err }))

}

const loadMoreComment = (req, res, next) => {
    let { PostId, offset } = req.body;
    limit = 5;
    postsService
        .loadMoreComment({ PostId, offset, limit })
        .then(result => res.json(result))
}

const exportPostAsPdf = async (req, res, next) => {
    try {
        let post = await postsService.get({ slug: req.params.slug });
        //console.log("DATA: ", JSON.parse(post.dataValues.content));
        subService.exportPdf(res, JSON.parse(post.dataValues.content), post.dataValues.slug)
    } catch (err) {
        next(err);
    }
}

const search = (req, res, next) => {
    let page = req.query.page;
    let searchStr = req.query.text;
    let limit = 8;
    let offset = (page - 1) * limit;
    postsService
        .search({ searchStr, offset, limit })
        .then(result => {
            let { posts, count } = result;
            let pagination = createPagesArr(page, count, limit);
            res.render('posts/search', { posts, count, text: searchStr, page, pagination, highlightSearchText });
        })
        .catch(err => next(err));
}

router.get('/exports/:slug', exportPostAsPdf)
router.get('/detail/:slug', renderDetailPost)
router.get('/tags/:tag/:page', renderAllPosts)
router.get('/:maincate/:page', renderAllPosts)
router.get('/:maincate/:subcate/:page', renderAllPosts)

router.get('/search', search);
router.get('/', (req, res, next) => res.redirect('/posts/all/1'))



// Ajax
router.post('/comment', addComment)
router.post('/comment/loadmore', loadMoreComment)
// Ajax

module.exports = router;