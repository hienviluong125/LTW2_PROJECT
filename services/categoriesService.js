const db = require('./../models/index');


async function getAllCategories(){
    return db.MainCategories.findAll({
        include: [db.SubCategories]
    });
}


module.exports ={
    getAllCategories
};