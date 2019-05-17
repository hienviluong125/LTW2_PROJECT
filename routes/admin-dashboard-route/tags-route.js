const router = require('express').Router();
const tagService = require('./../../services/tagService');

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

const updateTagHandler = (req, res, next) => {
    let tag = req.body;
    console.log(tag);
    tagService.update(tag)
    .then(changedRows => {
        req.flash('tags-flash', {message: "Update tag successfully!", className:"success"});
        res.redirect('/admin/tags');
    })
    .catch(err => {
        next(err);
    })
}

const deleteTagHandler = (req, res, next) => {
    let tagId = req.body.id;
    tagService.deleteTag(+tagId)
    .then(changedRows => {
        req.flash('tags-flash', {message: "Delete tag successfully!", className:"success"});
        res.redirect('/admin/tags');
    })
    .catch(err => {
        next(err);
    })
}

router.get('/', renderTagsDashboard);
router.get('/edit/:id', renderEditTag);
router.get('/delete/:id', renderDeleteTag);

router.post('/edit/:id', updateTagHandler);
router.post('/delete/:id', deleteTagHandler);


module.exports = router;