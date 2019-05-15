const subscriberModel = require('./../models/index').Subscribers;

function create(UserId){
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return subscriberModel.create({
        UserId,
        expireDate: date,
        status: 'valid'
    });
}

function getLatestSubscription(UserId){
    return subscriberModel.findOne({
        raw: true,
        where:{
            UserId
        },
        order: [ [ 'createdAt', 'DESC' ]]
    })
}

module.exports = {
    create,
    getLatestSubscription
}