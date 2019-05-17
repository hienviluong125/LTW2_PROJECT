const router = require('express').Router();
const middleware = require('./../middlewares/index');
const subService = require('./../services/subscriberService');

const renderExtendSubscriptionPage = async (req, res, next) => {   
    Promise.all([subService.getLatestSubscription(req.user.id), 
        await subService.isPremium(req.user.id)
    ])
    .then(results => {
        res.render('sub/extend-subscription',{
            date: results[0].expireDate,
            status: results[0].status,
            isPremium: results[1]
        })
    })
    .catch(err => {
        next(err)
    });    
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