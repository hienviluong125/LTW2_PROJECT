const db = require('./../models/index');
const { str_to_slug } = require('./../helpers/utils');

async function creatTags({ tags }) {
    return Promise.all(tags.map(n => {
        return db.Tags.findOrCreate({
            where: {
                name: n
            },
            defaults: {
                name: n,
                slug: str_to_slug(n)
            }
        })
    }));
}

async function addTagsToPost({ tagIds, postId }) {
    try{
        return Promise.all(tagIds.map(async t_id => {
            return await db.PostTags.create({
                PostId: postId,
                TagId: t_id
            });
    }))
    }catch(err){
        console.log({err});
    }
    
}

async function removeTagsOfPost({ postId }) {
    return db.PostTags.destroy({
        where: {
            PostId: postId
        }
    });
}

function getAll(){
    return db.Tags.findAll({
        raw:true,
        order: [ [ 'id', 'ASC' ]]
    });
}

function findOne(id){
    return db.Tags.findOne({
        where: {
            id
        },
        raw: true
    });
}

function update(tag){
    tag.slug = str_to_slug(tag.name);
    return db.Tags.update(tag, {
        where:{id: tag.id}
    });
}

function removeTagById(tagId){
    return db.PostTags.destroy({
        where:{
            TagId:tagId
        }
    })
}

async function deleteTag(id){
    try{
        let deletedRows = await removeTagById(+id);
        console.log(`deleted ${deletedRows} post-tag.`);
        return db.Tags.destroy({
            where:{
                id
            }
        });
    }
    catch(err){
        throw err;
    }
}

function createOne(name){
    return db.Tags.create({
        name,
        slug: str_to_slug(name)
    });
}


module.exports = {
    creatTags,
    addTagsToPost,
    removeTagsOfPost,
    getAll,
    findOne,
    update,
    deleteTag,
    createOne
}