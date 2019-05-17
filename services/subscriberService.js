const subscriberModel = require('./../models/index').Subscribers;

function getRenewalDate(){
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
}

function create(UserId, isFirstTime = false ){
    let date = getRenewalDate();
    return subscriberModel.create({
        UserId,
        expireDate: date,
        status: isFirstTime? 'valid' : 'pending'
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

async function renewSubscription(UserId){
    try{
        let latestSub = await getLatestSubscription(UserId);
        latestSub.status = 'valid';
        latestSub.expireDate = getRenewalDate();
        return subscriberModel.update(latestSub, {
            where: {
                UserId: latestSub.UserId,
                id: latestSub.id
            }
        })
    }catch(err){
        throw err;
    }
}

async function isPremium(UserId){
    try{
        let latestSub = await getLatestSubscription(UserId);
        let now = new Date();
        return (now.getTime() < latestSub.expireDate.getTime()) ? true : false;
    }catch(err){
        throw err;
    }
}

module.exports = {
    create,
    getLatestSubscription,
    renewSubscription,
    isPremium
}