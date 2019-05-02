const writerModel = require('./../models/index').Writes;

function create(user){

    return writerModel.create({
        UserId: user.id,
        PenName: user.username
    });
}

module.exports ={
    create
};