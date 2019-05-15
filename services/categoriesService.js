const db = require('./../models/index');


async function getAllCategories(){
    return db.MainCategories.findAll({
        include: [db.SubCategories]
    });
}

async function getAllSubCategoriesOfEditor({EditorId}){
    let subCates = await db.Users.findOne({
        attributes:['id'],
        where: {
            id: EditorId
        },
        include: [{
            attributes:['name','id','slug'],
            model: db.SubCategories,
        }]
    });

    return subCates.SubCategories;

}

module.exports ={
    getAllCategories,
    getAllSubCategoriesOfEditor
};