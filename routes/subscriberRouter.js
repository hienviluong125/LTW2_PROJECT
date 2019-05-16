const router = require('express').Router();
const middleware = require('./../middlewares/index');
const subService = require('./../services/subscriberService');
const htmlDateParser = require('./../utils/htmlDateFormat');

const renderExtendSubscriptionPage = (req, res, next) => {   
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

const extendSubscriptionHandler = (req, res, next) => {
    subService.create(req.body.UserId)
    .then(sub => {
        console.log(`subscription request from user: ${sub.UserId}`);
        res.redirect(`/subscribers/extend`);
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

router.post("/extend", extendSubscriptionHandler);

module.exports = router;