const router = require('express').Router();
const middleware = require('./../middlewares/index');
const subService = require('./../services/subscriberService');
const htmlDateParser = require('./../utils/htmlDateFormat');
renderExtendSubscriptionPage = (req, res, next) => {
    subService.getLatestSubscription(req.user.id)
    .then(subscription => {
        res.render('sub/extend-subscription',{
            date: subscription.expireDate,
            status: subscription.status,
            now: new Date()
        });
    })
    .catch(err => {
        next(err);
    })
}

router.all("*", 
    middleware.Authentication,
    middleware.Authorization(['sub'])
);

router.get("/extend", renderExtendSubscriptionPage);

module.exports = router;