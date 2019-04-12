const db = require('./../models/index');
const MainCategories = db.MainCategories;
const SubCategories = db.SubCategories;
const Posts = db.Posts;
const faker = require('faker');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(async function () {



    // MainCategories.create({
    //     name: 'MainCate01'
    // });


    // MainCategories.create({
    //     name: 'MainCate02'
    // });

    // MainCategories.create({
    //     name: 'MainCate03'
    // });



    // MainCategories.findAll({
    //     raw: true,
    //     include: [
    //         {
    //             model: SubCategories
    //         }
    //     ]
    // }).then(res => console.log("res -> ",res));


    // for (let i = 0; i < 10; i++) {
    //     Posts.create({
    //         title: faker.lorem.sentence(),
    //         content: faker.lorem.sentences(),
    //         SubCategoryId: getRandomInt(1, 3),
    //         MainCategoryId: getRandomInt(1,3)
    //     })
    // }








    // Posts.findAll({
    //     raw: true,
    //     include: [
    //         {
    //             model: MainCategories
    //         },
    //         {
    //             model: SubCategories
    //         }
    //     ]
    // }).then(res => console.log("res -> ", res));

    MainCategories.findAll({
        raw: true,
        include: [
            {
                model: Posts
            }
        ]
    }).then(res => console.log("res -> ", res));



})()