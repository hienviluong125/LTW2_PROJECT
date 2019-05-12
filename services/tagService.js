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

module.exports = {
    creatTags,
    addTagsToPost,
    removeTagsOfPost
}