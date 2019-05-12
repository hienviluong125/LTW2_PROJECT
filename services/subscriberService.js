const subscriberModel = require('./../models/index').Subscribers;

function create(UserId){
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return subscriberModel.create({
        UserId,
        expireDate: date
    });
}

module.exports = {
    create
}