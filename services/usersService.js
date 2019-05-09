const User = require('./../models/index').Users;
const bcrypt = require('bcrypt');
const crypto = require('../config/crypto');
const validator = require('validator');
const jwt = require('jwt-simple');

async function getAllUsers(){
    return User.findAll({raw: true});
};

function isEmail(email){
    return validator.isEmail(email);
}

async function validateRegisterData(email, password, repassword){
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
    if(!isEmail(email)){
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
        throw err;
    });
    return errors;
}

async function create(user){
    let hash = await bcrypt.hash(password, crypto.iteration)
    user.password = hash;
    return User.create(user);
}

async function findOneByEmail(email){
    return User.findOne({
        raw:true, 
        where:{email}
    });
}

function generateUserSecret(user){
    return user.password + '-' + user.createdAt.getTime();
}

function generateRecoveryPasswordToken(user){
    let payload = {
        id: user.id,
        email: user.email,
        exp: Math.round(Date.now() / 1000 + 5 * 3600)
    };
    let secret = generateUserSecret(user);
    return jwt.encode(payload, secret, "HS256", {header: {exp: payload.exp}});
}

async function findOne(id){
    return User.findByPk(id, {
        raw: true
    });
}

function decodeRecoveryPasswordToken(user, token){
    try {
        if (user !== null) {
            return jwt.decode(token, generateUserSecret(user));
        }
    } catch (err) {
        throw err;
    }
}

async function changePassword(user, newPassword){
    try{
        console.log("old pass: ", user.password);
        console.log("user: ", user);
        let hash = await bcrypt.hash(newPassword, crypto.iteration);
        console.log("new hash:", hash);
        return User.update({password: hash}, {
            where: {id: user.id}
        });
    }catch(err){
        throw err;
    }   
}



module.exports = {
    getAllUsers,
    validateRegisterData,
    create,
    isEmail,
    findOneByEmail,
    generateRecoveryPasswordToken,
    findOne,
    decodeRecoveryPasswordToken,
    changePassword
}
