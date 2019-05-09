const db = require('./../models/index');
const tagService = require('./tagService');

async function add({ username, title, shortContent, slug, MainCategoryId, SubCategoryId, content, tags, thumbnail }) {
    try {
        let foundUser = await db.Users.findOne({
            where: { username }
        });
        let WriterId = foundUser.dataValues.id;
        //add new post
        let addPost = await db.Posts.create({
            WriterId,
            title,
            shortContent,
            slug,
            MainCategoryId,
            SubCategoryId,
            thumbnail,
            content: JSON.stringify(content),
            status: 'pending'
        });

        //add tags if has
        //update to PostTags table (many-many)
        if (addPost && addPost.dataValues && tags.length > 0) {
            let postId = addPost.dataValues.id;
            let findTagsOrCreate = await tagService.creatTags({ tags });
            let tagIds = findTagsOrCreate.map(t => {
                return t[0].dataValues.id;
            })
            await tagService.addTagsToPost({ tagIds, postId });
        }

        return { status: true, data: addPost }
    } catch (err) {
        console.log({ err });
        return { status: false, err: err.toString() }
    }

}

async function get({slug,WriterId}){
    const post = db.Posts.findOne({
        where: {
            slug
        },
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users
        ]
    });
    // console.log(post);
    return post;
}


module.exports = {
    add,
    get
};