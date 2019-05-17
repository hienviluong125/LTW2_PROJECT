const router = require('express').Router();
const middleware = require('./../middlewares/index');
const tagsRoute = require('./admin-dashboard-route/tags-route');

router.all('*',
    middleware.Authentication,
    middleware.Authorization(['admin'])
)

const renderDashboardPage = (req, res, next) => {
    res.render('admin/dashboard');
}

router.get('/', renderDashboardPage);

router.use('/tags', tagsRoute);

module.exports = router;