const router = require('express').Router();

const renderPosts = (req,res,next) => {
    let cate = req.params.cate;
    let page = req.params.page;
    console.log({cate,page});
    if(typeof cate === 'undefined' || typeof page === 'undefined'){
        res.redirect('/posts/all/1');
    }else{
        res.json({cate,page});
    }
};


router.get('/posts/:cate/:page',renderPosts);

module.exports = router;