const router = require('express').Router();
const userService = require('./../../services/usersService');

function redirect(req, res, flash){
    req.flash('flash-categories', {message: flash.message, className: flash.className});
    res.redirect('/admin/users');
}

const renderUserIndexPage = (req, res, next) => {
    userService.getAllUsers()
    .then(users => {
        res.render('admin/users/index', {
            users,
            flash: req.flash('flash-categories')
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderAddUserPage = (req, res, next) => {
    res.render('admin/users/add');
}

const renderEditUserPage = (req, res, next) => {
    userService.findOne(req.params.id)
    .then(user => {
        res.render('admin/users/edit',{
            user
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
            user
        })
    })
    .catch(err => {
        next(err);
    })
}

const renderExtendSubscriptionPage = (req, res, next) => {
    //TODOS: set up the layouts
    
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

router.get('/', renderUserIndexPage);
router.get('/add', renderAddUserPage);
router.get('/edit/:id', renderEditUserPage);
router.get('/delete/:id', renderDeleteUserPage);
router.get('/extend', renderExtendSubscriptionPage);


router.post('/add', addUserHandler);
router.post('/edit/:id', editUserHandler);
router.post('/delete/:id', deleteUserHandler);

module.exports = router;