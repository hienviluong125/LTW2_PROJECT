const router = require('express').Router();
const catService = require('./../../services/categoriesService');

const successRedirect = (req, res, message) => {
    req.flash('categories-flash', {message, className:"success"});
    res.redirect('/admin/categories');
}

const failRedirect = (req, res, message) => {
    req.flash('categories-flash', {message, className:"danger"});
    res.redirect('/admin/categories');
}

const renderAddCatPage = (req, res, next) => {
    res.render('admin/categories/add',{
        isSubCat: false
    });
}

const renderAddSubCatPage = (req, res, next) => {
    catService.getAllMainCats()
    .then(mainCats => {
        res.render('admin/categories/add',{
            isSubCat:true,
            mainCats
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderIndexCategoriesPage = (req, res, next) => {
    catService.getAllCategories()
    .then(data => {
        data.forEach(mainCat => {
            console.log(mainCat.dataValues); 
            mainCat.SubCategories.forEach(subCat => {
                console.log(subCat.dataValues);
            })
        })
        res.render('admin/categories/index',{
            data,
            flash: req.flash('categories-flash')
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderEditCatPage = (req, res, next) => {
    catService.findOne(req.params.id, 'main')
    .then(cat => {
        res.render('admin/categories/edit',{
            cat
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderDeleteCatPage = (req, res, next) => {
    catService.findOne(req.params.id, 'main')
    .then(cat => {
        res.render('admin/categories/delete',{
            cat
        })
    })
    .catch(err => {
        console.log(err);
        next(err);
    })
}

const renderEditSubCatPage = (req, res, next) => {
    Promise.all([catService.findOne(req.params.id, 'sub'),
        catService.getAllMainCats()
    ])
    .then(data => {
        res.render('admin/categories/edit',{
            cat: data[0],
            isSubCat: true,
            mainCats: data[1]
        })
    })
    .catch(err => {
        failRedirect(req, res, "Cannot delete sub category, it still has posts, etc..");
    })
}

const renderDeleteSubCatPage = (req, res, next) => {
    catService.findOne(req.params.id, 'sub')
    .then(cat => {
        catService.findOne(cat.MainCategoryId, 'main')
        .then(mainCat => {
            res.render('admin/categories/delete',{
                cat,
                mainCat
            })
        })     
    })
    .catch(err => {
        next(err);
    })
}

const addCatHandler = (req, res, next) => {
    catService.create(req.body, 'main')
    .then(result => {
        successRedirect(req, res, "Main category added successfully!");
    })
    .catch(err => {
        next(err);
    })
}

const addtSubCatHandler = (req, res, next) => {
    console.log(req.body);
    catService.create(req.body, 'sub')
    .then(result => {
        successRedirect(req, res, "Sub category added successfully!");
    })
    .catch(err => {
        next(err);
    })
}

const editCatHandler = (req, res, next) => {
    catService.update(req.body, 'main')
    .then(result => {
        successRedirect(req, res, "Main category updated successfully");
    })
    .catch(err => {
        next(err);
    })
}

const deleteCatHandler = (req, res, next) => {
    catService.deleteCat(req.params.id, 'main')
    .then(rows => {
        successRedirect(req, res, "Main category deleted successfully!");
    })
    .catch(err => {
        console.log(err);
        failRedirect(req, res, "Cannot delete main category, it still has posts,sub categories, etc..");
    })
}

const editSubCatHandler = (req, res, next) => {
    catService.update(req.body, 'sub')
    .then(result => {
        successRedirect(req, res, "Sub category updated successfully");
    })
    .catch(err => {
        next(err);
    })
}

const deleteSubCatHandler = (req, res, next) => {
    catService.deleteCat(req.params.id, 'sub')
    .then(rows => {
        successRedirect(req, res, "Sub category deleted successfully!");
    })
    .catch(err => {
        console.log(err);
        failRedirect(req, res, "Cannot delete sub category, it still has posts, etc..");
    })
}

router.get('/', renderIndexCategoriesPage);
router.get('/add', renderAddCatPage);
router.get('/edit/:id', renderEditCatPage);
router.get('/delete/:id', renderDeleteCatPage);

router.get('/sub/add', renderAddSubCatPage);
router.get('/sub/edit/:id', renderEditSubCatPage);
router.get('/sub/delete/:id', renderDeleteSubCatPage);



router.post('/add', addCatHandler);
router.post('/edit/:id', editCatHandler);
router.post('/delete/:id', deleteCatHandler);

router.post('/sub/add', addtSubCatHandler);
router.post('/sub/edit/:id', editSubCatHandler);
router.post('/sub/delete/:id', deleteSubCatHandler);

module.exports = router;