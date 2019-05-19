const db = require('./../models/index');
const { str_to_slug } = require('./../helpers/utils');
const postsService = require('./../services/postsService');

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

function create(cat, type){
    if(type == 'main'){
        return db.MainCategories.create({
            name: cat.name,
            slug: str_to_slug(cat.name)
        })
    }else if(type == 'sub'){
        return db.SubCategories.create({
            name: cat.name,
            slug: str_to_slug(cat.name),
            MainCategoryId: cat.MainCategoryId
        })
    }
}

function getAllMainCats(){
    return db.MainCategories.findAll({
        raw: true
    });
}

function findOne(id, type){
    if(type == 'main'){
        return db.MainCategories.findOne({
            where:{id},
            raw:true
        });
    }else if(type == 'sub'){
        return db.SubCategories.findOne({
            where:{id},
            raw:true
        });
    }
}

function update(cat, type){
    cat.slug = str_to_slug(cat.name);
    if(type == 'main'){
        return db.MainCategories.update(cat, {
            where:{id: cat.id},
        });
    }else if(type == 'sub'){
        return db.SubCategories.update(cat, {
            where:{id: cat.id},
        });
    }
}

function deleteSubCat(mainCatId){
    return db.SubCategories.destroy(
        {
            where:{
                MainCategoryId: mainCatId
            }
        }
    );
}

async function deleteCat(id, type){
    if(type == 'main'){
        try{
            let deletedPosts = await postsService.deleteByMainCatId(id);
            let deletedRows = await deleteSubCat(id);
            console.log(`deleted ${deletedPosts} posts`);
            console.log(`deleted ${deletedRows} sub categories`);
            return db.MainCategories.destroy({
                where:{
                    id
                }
            });
        }catch(err){
            throw err;
        }
    }else if(type == 'sub'){
        try{
            let deletedPosts = await postsService.deleteBySubCatId(id);
            return db.SubCategories.destroy({
                where:{
                    id
                }
            });
        }catch(err){
            throw err;
        }
        
    }
}

module.exports ={
    getAllCategories,
    getAllSubCategoriesOfEditor,
    create,
    getAllMainCats,
    findOne,
    update,
    deleteCat
};