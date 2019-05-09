const writerModel = require('./../models/index').Writes;

function findOne(userId){
    if(Number.isNaN(userId)){
        throw new Error("Can not parse userId");
    }
    return writerModel.findOne({
        raw: true,
        where: {
            UserId: +userId
        }
    });
}

function create(user){

    return writerModel.create({
        UserId: user.id,
        PenName: user.username
    });
}

module.exports ={
    create,
    findOne
};