const User = require('./../models/index').Users;
const bcrypt = require('bcrypt');
const crypto = require('../config/crypto');
const validator = require('validator');


async function getAllUsers(){
    return User.findAll({raw: true});
};

async function validateRegisterData(email, password, repassword, next){
    let errors = [];
    if(!email || !password || !repassword){
        errors.push({message:"Please fill in all fields."});
    }
    if(password !== repassword){
        errors.push({message:"Passwords do not match."});
    }
    if(password.length < 6){
        errors.push({message:"Passwords must have at least 6 characters"});
    }
    if(!validator.isEmail(email)){
        errors.push({message:"Email is not valid"});
    }
    await findOneByEmail(email)
    .then(user =>{
        console.log(user);
        if(user){
            errors.push({message:"Email already taken"});
        }
    })
    .catch(err => {
        next(err);
    });
    return errors;
}

async function create(user){
    let hash = await bcrypt.hash(user.password, crypto.iteration)
    user.password = hash;
    return User.create(user);
}

async function findOneByEmail(email){
    return User.findOne({
        raw:true, 
        where:{email}
    });
}



module.exports = {
    getAllUsers,
    validateRegisterData,
    create,
}
