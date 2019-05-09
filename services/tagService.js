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
    return Promise.all(tagIds.map(t_id => {
        return db.PostTags.create({
            PostId: postId,
            TagId: t_id
        });
    }))
}

module.exports = {
    creatTags,
    addTagsToPost
}