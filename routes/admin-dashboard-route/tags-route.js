const router = require('express').Router();
const tagService = require('./../../services/tagService');

const successRedirect = (req, res, message) => {
    req.flash('tags-flash', {message, className:"success"});
    res.redirect('/admin/tags');
}

const renderTagsDashboard = (req, res, next) =>{
    tagService.getAll()
    .then(tags => {
        res.render('admin/tags/index',{
            tags,
            flash: req.flash('tags-flash')
        });
    })
    
}

const renderEditTag = (req, res, next) => {
    tagService.findOne(+req.params.id)
    .then(tag => {
        res.render('admin/tags/edit', {
            tag
        })
    })
    .catch(err =>{
        next(err);
    })
}

const renderDeleteTag = (req, res, next) => {
    tagService.findOne(+req.params.id)
    .then(tag => {
        res.render('admin/tags/delete', {
            tag
        })
    })
    .catch(err =>{
        next(err);
    })
}

const renderAddTag = (req,res, next) => {
    res.render('admin/tags/add');
}

const updateTagHandler = (req, res, next) => {
    let tag = req.body;
    console.log(tag);
    tagService.update(tag)
    .then(changedRows => {
        successRedirect(req, res, "Tag updated successfully!");
    })
    .catch(err => {
        next(err);
    })
}

const deleteTagHandler = (req, res, next) => {
    let tagId = req.body.id;
    tagService.deleteTag(+tagId)
    .then(changedRows => {
        successRedirect(req, res, "Tag deleted sucessfully");
    })
    .catch(err => {
        next(err);
    })
}

const addTagHandler = (req, res, next) => {  
    tagService.createOne(req.body.name)
    .then(result => {
        successRedirect(req, res, "Tag added successfully!");
    })
    .catch(err => {
        next(err);
    })
}

router.get('/', renderTagsDashboard);
router.get('/add', renderAddTag);
router.get('/edit/:id', renderEditTag);
router.get('/delete/:id', renderDeleteTag);


router.post('/add', addTagHandler);
router.post('/edit/:id', updateTagHandler);
router.post('/delete/:id', deleteTagHandler);


module.exports = router;