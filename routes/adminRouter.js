const router = require('express').Router();
const middleware = require('./../middlewares/index');
const tagsRoute = require('./admin-dashboard-route/tags-route');
const categoriesRoute = require('./admin-dashboard-route/categories-route');
const usersRoute = require('./admin-dashboard-route/users-route');
const postsRoute = require('./admin-dashboard-route/posts-route');

router.all('*',
    middleware.Authentication,
    middleware.Authorization(['admin'])
)

const renderDashboardPage = (req, res, next) => {
    res.render('admin/dashboard',{
        layout: 'admin/common/main'
    });
}

router.get('/', renderDashboardPage);

router.use('/tags', tagsRoute);
router.use('/categories', categoriesRoute);
router.use('/users', usersRoute)
router.use('/posts', postsRoute);

module.exports = router;