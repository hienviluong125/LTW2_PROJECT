const subscriberModel = require('./../models/index').Subscriber;

function create(UserId){
    console.log(subscriberModel);
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