const router = require('express').Router();
const userService = require('./../../services/usersService');
const subService = require('./../../services/subscriberService');
const catService = require('./../../services/categoriesService.js');
function redirect(req, res, flash){
    req.flash('flash-categories', {message: flash.message, className: flash.className});
    res.redirect('/admin/users');
}

const renderUserIndexPage = (req, res, next) => {
    userService.getAllUsers()
    .then(users => {
        res.render('admin/users/index', {
            users,
            flash: req.flash('flash-categories'),
            layout: 'admin/common/main'
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderAddUserPage = (req, res, next) => {
    res.render('admin/users/add',{
        layout: 'admin/common/main'
    });
}

const renderEditUserPage = (req, res, next) => {
    userService.findOne(req.params.id)
    .then(user => {
        res.render('admin/users/edit',{
            user,
            layout: 'admin/common/main'
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderDeleteUserPage = (req, res, next) => {
    userService.findOne(req.params.id)
    .then(user => {
        res.render('admin/users/delete',{
            user,
            layout: 'admin/common/main'
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderExtendSubscriptionPage = (req, res, next) => {
    //TODOS: set up the layouts
    Promise.all([subService.isPremium(+req.params.id),
        subService.getLatestSubscription(+req.params.id)
    ])
    .then(data => {
        res.render('admin/users/extend', {
            sub: data[1],
            isPremium: data[0]
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderDelegateCategoriesPage = (req, res, next) => {
    Promise.all([
        catService.getAllSubCats(),
        catService.getAllSubCategoriesOfEditor({EditorId: +req.params.id})
    ])
    .then(data => {
        data[1].forEach(cat => {
            console.log(cat.dataValues)
        })
        res.render('admin/users/delegate',{
            subCats: data[0],
            editorCats: data[1]
        })
    })
    .catch(err => {
        next(err);
    })
}

const addUserHandler = (req, res, next) => {
    try{
        userService.createWithRole(req.body)
        .then(rows => {
            redirect(req, res, {
                message: "User added successfully!",
                className: "success"
            });
        })

    }catch(err){
        redirect(req, res, {
            message: "Something went wrong, cannot create user",
            className: "warning"
        });
    } 
}

const editUserHandler = (req, res, next) => {
    try{
        userService.updateInfo(req.body)
        .then(rows => {
            redirect(req, res, {
                message: "User info updated successfully!",
                className: "success"
            });
        })
    }catch(err){
        redirect(req, res, {
            message: "User info failed to update..",
            className: "info"
        });
    }
}

const deleteUserHandler = async(req, res, next) => {
    userService.deleteUser(+req.body.id)
        .then(rows => {
            redirect(req, res, {
                message: "User deleted successfully!",
                className: "success"
            });
        })
        .catch(err => {
            redirect(req, res, {
                message: "User still has posts/permissions, cannot delete",
                className: "danger"
            });
        })
}

const extendSubscriptionHandler = (req, res, next) => {
    subService.renewSubscription(+req.params.id)
    .then(result => {
        redirect(req, res, {
            message: "Subscriber's subscriptions is extended!",
            className: "success"
        })
    })
    .catch(err => {
        redirect(req, res, {
            message: "Something went wrong, please try again..",
            className: "warning"
        })
    })
}

const delegateCategoriesPage = (req, res, next) => {
    console.log(req.body.SubCategoryId);
    catService.delegateSubCatsToEditor(+req.params.id, req.body.SubCategoryId)
    .then(() => {
        redirect(req, res, {className: 'success', message:'Success!'})
    })
    .catch(err => {
        redirect(req, res, {className: 'danger', message:'Something went wrong..'})
    })
   
}

router.get('/', renderUserIndexPage);
router.get('/add', renderAddUserPage);
router.get('/edit/:id', renderEditUserPage);
router.get('/delete/:id', renderDeleteUserPage);
router.get('/extend/:id', renderExtendSubscriptionPage);
router.get('/delegate/:id', renderDelegateCategoriesPage);


router.post('/add', addUserHandler);
router.post('/edit/:id', editUserHandler);
router.post('/delete/:id', deleteUserHandler);
router.post('/extend/:id', extendSubscriptionHandler);
router.post('/delegate/:id', delegateCategoriesPage);
module.exports = router;