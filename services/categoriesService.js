const db = require('./../models/index');
const MainCategories = db.MainCategories;
const SubCategories = db.SubCategories;

async function getAllCategories(){
    return MainCategories.findAll({
        include: [SubCategories]
    });
}


module.exports ={
    getAllCategories
};