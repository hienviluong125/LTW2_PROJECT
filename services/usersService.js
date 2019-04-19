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
    console.log(user.password);
    return User.create(user);
}

async function findOneByEmail(email){
    return User.findOne({
        raw:true, 
        where:{email}
    });
}

async function comparePassword(user, hashedPassword){
    let errors = [];
    let account = await findOneByEmail(user.email);
    if(!account){
        errors.push({message:"Account does not exist"});

    }else{
        try{
            bcrypt.compare(user.password, hashPassword, (err, res) =>{
                if(res == false){
                    errors.push({message:"Account does not exist"});
                }
            });
        }catch(err){
            throw err;
        } 
    }
    return errors;
}



module.exports = {
    getAllUsers,
    validateRegisterData,
    create,
    comparePassword
}
