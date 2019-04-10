const db = require('./../models/index');
const faker = require('faker');
const users = db['users'];
const posts = db.posts;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function () {




    // posts.findAll({
    //     raw: true,
    //     include : [
    //         {
    //             model: users,
    //             attributes: ['fullname']
    //         }
    //     ]
    // })


    

    // users.findAll({
    //     where : {
    //         id : 3
    //     },
    //     raw: true,
    //     include: [
    //         {
    //             model: posts,
    //         }
    //     ]
    // })
    //     .then(res => {
    //         console.log("result -> ", res);
    //     })




})()