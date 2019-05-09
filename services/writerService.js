const writerModel = require('./../models/index').Writers;

function create(user){

    return writerModel.create({
        UserId: user.id,
        PenName: user.username
    });
}

module.exports = {
    create
}