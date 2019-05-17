const router = require('express').Router();

const renderTagsDashboard = (req, res, next) =>{
    res.render('admin/tags');
}

router.get('/', renderTagsDashboard);

module.exports = router;