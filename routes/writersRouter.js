const router = require('express').Router();
const upload = require('./../helpers/uploader');
const postsService = require('./../services/postsService');
const categoriesSerivce = require('./../services/categoriesService');
const faker = require('faker');


const renderPostListPage = (req, res, next) => {
    let posts = [];
    for(let i = 0;i<15;i++){
        posts.push({
            title: faker.name.jobTitle(),
            mainCateName: faker.name.jobType(),
            subCateName: faker.name.jobType(),
            content: faker.lorem.sentences(),
            views: faker.random.number(),
            status: 'Chờ duyệt',
            comments: faker.random.number()
        });
        
    }

    res.render('writers/posts',{posts});
}

const renderAddPostPage = (req, res, next) => {
    categoriesSerivce
        .getAllCategories()
        .then(allCategories => {
            res.render('writers/posts/add', { allCategories });
        })


    // res.render('writers/posts/add', mockData);
}

const renderEditPostPage = (req, res, next) => {
    res.render('writers/posts/edit');
}

const addPost = (req, res, next) => {
    //sẽ thay thế là authorization middleware sau
    if (!req.user) {
        res.status(500).json({ err: "please login" });
    } else {
        let param = JSON.parse(req.body.data);
        param.username = req.user.username;
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

router.get('/posts', renderPostListPage);
router.get('/posts/add', renderAddPostPage);
router.get('/posts/edit', renderEditPostPage);

router.post('/posts/add', upload.array('images', 10), addPost);

module.exports = router;