const db = require('./../models/index');
const tagService = require('./tagService');

async function add({ WriterId, title, shortContent, slug, MainCategoryId, SubCategoryId, content, tags, thumbnail }) {
    try {
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

async function get({ slug, WriterId }) {
    return db.Posts.findOne({
        where: {
            slug
        },
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
            db.Tags
        ]
    });;
}

async function edit({ id, WriterId, title, shortContent, slug, MainCategoryId, SubCategoryId, content, tags, thumbnail }) {
    try {
        //edit post
        let editPost = await db.Posts.update(
            {
                title,
                shortContent,
                slug,
                MainCategoryId,
                SubCategoryId,
                thumbnail,
                content: JSON.stringify(content),
            },
            {
                where: {
                    WriterId, id
                }
            }
        );

        // //update to PostTags table (many-many)
        if (editPost && editPost && tags.length > 0) {
            let postId = id;

            await tagService.removeTagsOfPost({ postId });
            let findTagsOrCreate = await tagService.creatTags({ tags });
            let tagIds = findTagsOrCreate.map(t => {
                return t[0].dataValues.id;
            })

            await tagService.addTagsToPost({ tagIds, postId });
        }
        return { status: true, data: editPost }
    } catch (err) {
        return { status: false, err: err.toString() }
    }
}

async function _delete({ slug, WriterId }) {
    try {
        let postInfo = await db.Posts.findOne({ where: { slug } }, { raw: true });
        let postId = postInfo.id;
        await tagService.removeTagsOfPost({ postId });
        let data = await db.Posts.destroy({
            where: {
                slug, WriterId
            }
        })
        return { status: true, data: data }
    } catch (err) {
        console.log({ err });
        return { status: false, err: err.toString() }
    }


}


async function getAllPostByUserId({ id }) {
    return db.Posts.findAll({
        where: {
            WriterId: id
        },
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
            db.Tags
        ]
    });
}




module.exports = {
    add,
    get,
    edit,
    getAllPostByUserId,
    _delete
};