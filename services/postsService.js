const db = require('./../models/index');
const tagService = require('./tagService');
const { Op } = require('sequelize')

async function getAllPosts({offset,limit}) {
    try {
        await updateReleasedPost();
        let posts = await db.Posts.findAll({
            where: {
                status: 'published',
            },
            include: [
                db.MainCategories,
                db.SubCategories,
                db.Users,
                db.Tags,
                db.Notes
            ]
        });

        let count = await db.Posts.count({
            where: {
                status: 'published',
            },
        })

        // let count = await db.Posts.count({
        //     where: queryOps,
        // })
        return { status: true, data: { posts,count } }
    } catch (err) {
        console.log(err);
        return { status: false, err };
    }

}

async function add({ WriterId, title, shortContent, slug, MainCategoryId, SubCategoryId, content, tags, thumbnail }) {
    try {
        let isExistSameSlug = await db.Posts.findOne({ where: { slug } }, { raw: true });
        if (isExistSameSlug) {
            return { status: false, err: 'This title of post already exists' };
        }
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

async function get({ slug }) {
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
        let isExistSameSlug = await db.Posts.findOne({ where: { title } }, { raw: true });
        if (isExistSameSlug && isExistSameSlug.id !== id) {
            return { status: false, err: 'This title of post already exists' };
        }
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

// pending - verified - published - rejected
async function getAllPostByUserId({ id, limit, offset, status }) {
    try {
        await updateReleasedPost();
        let queryOps = {};
        if (status === 'all') {
            queryOps = { WriterId: id }
        } else {
            queryOps = {
                WriterId: id,
                status: status
            }
        }
        let posts = await db.Posts.findAll({
            where: queryOps,
            limit: limit,
            offset: offset,
            include: [
                db.MainCategories,
                db.SubCategories,
                db.Users,
                db.Tags,
                db.Notes
            ]
        });
        let count = await db.Posts.count({
            where: queryOps,
        })
        return { status: true, data: { posts, count } }
    } catch (err) {
        console.log(err);
        return { status: false, err };
    }
}

// pending - verified - published - rejected
async function getAllPostManagedByEditor({ SubCate, EditorId, limit, offset }) {
    try {
        //POSTS
        let data = await db.Users
            .findOne({
                // include:[db.Users],
                attributes: ['id'],
                where: {
                    id: EditorId
                },
                include: [{
                    model: db.SubCategories,
                    where: SubCate === 'all' ? {} : {
                        slug: SubCate
                    },
                    include: [{
                        model: db.Posts,
                        where: {
                            'status': 'pending',
                        },
                        limit: limit,
                        offset: offset,
                        include: [
                            db.MainCategories,
                            db.SubCategories,
                            db.Users,
                            db.Tags,
                        ]
                    }]
                }]
            });
        //END POSTS

        if (!data) {
            return { status: false, data: 'no exists data' };
        }

        //COUNT
        let count = -1;
        if (SubCate === 'all') {
            let allSubCateIds = await db.EditorCategories.findAll({ raw: true, attributes: ['SubCategoryId'], where: { UserId: EditorId } });
            allSubCateIds = allSubCateIds.map(aS => aS.SubCategoryId);
            count = await db.Posts.count({
                where: {
                    SubCategoryId: allSubCateIds
                }
            });
        } else {
            count = await db.Posts.count({
                include: [
                    {
                        model: db.SubCategories,
                        where: {
                            slug: SubCate
                        }
                    }
                ],
            });
        }
        //END COUNT

        let allPostWithSubcategory = data.dataValues.SubCategories;
        let mergedPosts = [];
        for (let eachsub of allPostWithSubcategory) {
            mergedPosts = [...mergedPosts, ...eachsub.Posts]
        }
        return {
            SubCategory: 'all',
            posts: mergedPosts,
            count: count
        }
    } catch (err) {
        console.log({ err });
        return { status: false, data: err };
    }

}

async function rejectPost({ WriterId, EditorId, PostId, NoteContent }) {
    try {
        await db.Posts.update(
            { status: 'rejected' },
            { where: { id: PostId } }
        );
        let isNoteExist = await db.Notes.findOne({ where: { EditorId, WriterId, PostId } });
        let result = null;
        if (isNoteExist) {
            result = await db.Notes.update(
                { status: 'rejected', content: NoteContent, },
                { where: { EditorId, WriterId, PostId } })
        } else {
            result = await db.Notes.create({
                status: 'rejected',
                content: NoteContent,
                EditorId,
                WriterId,
                PostId
            });
        }
        return { status: true, data: result };
    } catch (err) {
        console.log({ err });
        return { status: false, data: err };
    }
}

async function verifyPost({ releaseDate, tags, WriterId, EditorId, PostId, SubCategoryId, MainCategoryId, prevRouter }) {
    // console.log({ WriterId, EditorId, releaseDate, tags, PostId, SubCategoryId, MainCategoryId, prevRouter });
    // return { status: true, data: 'null' };
    try {
        let result = await db.Posts.update(
            { status: 'verified', releaseDate, SubCategoryId, MainCategoryId },
            { where: { id: PostId } }
        );
        if (tags.length > 0) {
            await tagService.removeTagsOfPost({ postId: PostId });
            let findTagsOrCreate = await tagService.creatTags({ tags });
            let tagIds = findTagsOrCreate.map(t => {
                return t[0].dataValues.id;
            })

            await tagService.addTagsToPost({ tagIds, postId: PostId });
        }
        return { status: true, data: result };
    } catch (err) {
        console.log({ err });
        return { status: false, data: err };
    }
};

async function updateReleasedPost() {
    try {
        let now = new Date();
        let data = await db.Posts.update(
            {
                status: 'published'
            },
            {
                where: {
                    status: 'verified',
                    releaseDate: {
                        [Op.lte]: now
                    },
                    createdAt: {
                        [Op.lte]: now
                    }
                }
            }
        )
        return data;
    } catch (err) {
        console.log(err);
    }

}

async function requestRejectedPost({ slug, WriterId }) {
    return db.Posts.update(
        { status: 'pending' },
        { where: { status: 'rejected', slug, WriterId } }
    );
}


module.exports = {
    add,
    get,
    edit,
    getAllPostByUserId,
    _delete,
    getAllPostManagedByEditor,
    rejectPost,
    verifyPost,
    updateReleasedPost,
    requestRejectedPost,
    getAllPosts
};