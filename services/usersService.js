const User = require('./../models/index').Users;
const bcrypt = require('bcrypt');
const crypto = require('../config/crypto');
const validator = require('validator');
const jwt = require('jwt-simple');
const db = require('./../models/index');
const subService = require('./subscriberService');

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
    let hash = await bcrypt.hash(user.password, crypto.iteration)
    user.password = hash;
    return User.create(user);
}

async function createWithRole(user){
    try{
        let createdUser = await create(user);
        if(user.role == 'admin'){
            return db.Admins.create({
                UserId: createdUser.id
            })
        }else if(user.role == 'sub'){
        	return subService.create(createdUser.id, true)
        }else if(user.role == 'writer'){
            return db.Writers.create({
                UserId: createdUser.id,
                PenName: createdUser.username
            })
        }else if(user.role == 'editor'){
            return db.Editors.create({
                UserId: createdUser.id
            })
        }
    }catch(err){
        throw err;
    }
    return new Error('Can not create user role in DB..');
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
    if(Number.isNaN(id)){
        throw new Error("Can not parse userId");
    }
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
        let hash = await bcrypt.hash(newPassword, crypto.iteration);
        console.log("password changed for userID: ", user.id);
        return User.update({password: hash}, {
            where: {id: user.id}
        });
    }catch(err){
        throw err;
    }   
}

function updateInfo(user){
    return User.update(user, {
        where: {id: user.id}
    });
}

function validateNewPasswords(password, repassword){
    let errors = [];
    if(!password || !repassword){
        errors.push({message:"Please fill in all fields."});
    }
    if(password.length < 6 || repassword.length < 6){
        errors.push({message:"Password must have at least 6 characters.", className:"warning"});
    }
    if(password !== repassword){
        errors.push({message:"Passwords do not match.", className:"warning"});
    }
    return errors;
}

function deleteUser(id){
    try {
        return User.destroy({
            where: {
                id
            }
        })
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
    changePassword,
    updateInfo,
    validateNewPasswords,
    deleteUser,
    createWithRole,
    
}
