const User = require('./../models/index').users;

async function getAllUsers(){
    return User.findAll({raw: true});
}


module.exports = {
   
}
