const db = require('./../models/index');
const tagService = require('./tagService');
const { Op, QueryTypes } = require('sequelize')
const sequelize = require('sequelize');

async function getAllPosts({ tag, maincate, subcate, offset, limit }) {
    try {
        let queryOps = {};
        let countOps = {};
        if (maincate) {
            if (maincate === 'all') {
                queryOps = {
                    where: { status: 'published' },
                    limit,
                    offset,
                    include: [db.MainCategories, db.SubCategories, db.Users, db.Tags, db.Notes]
                }
                countOps = { where: { status: 'published' } }
            } else if (subcate) {
                queryOps = {
                    where: { status: 'published' },
                    limit,
                    offset,
                    include: [
                        { model: db.MainCategories, where: { slug: maincate } },
                        { model: db.SubCategories, where: { slug: subcate } },
                        db.Users,
                        db.Tags,
                        db.Notes
                    ]
                }
                countOps = {
                    where: { status: 'published' },
                    include: [
                        { model: db.MainCategories, where: { slug: maincate } },
                        { model: db.SubCategories, where: { slug: subcate } }
                    ]
                }
            } else {
                queryOps = {
                    where: { status: 'published' },
                    limit,
                    offset,
                    include: [{ model: db.MainCategories, where: { slug: maincate } }, db.SubCategories, db.Users, db.Tags, db.Notes]
                }
                countOps = { where: { status: 'published' }, include: [{ model: db.MainCategories, where: { slug: maincate } }] }
            }
        }
        else if (tag) {
            let allPostsId = await db.Posts.findAll({ raw: true, where: { status: 'published' }, limit, offset, include: [{ model: db.Tags, where: { slug: tag } }] })
            allPostsId = allPostsId.map(p => p.id)
            queryOps = {
                where: { status: 'published', id: allPostsId },
                limit,
                offset,
                include: [db.MainCategories, db.SubCategories, db.Users, db.Tags, db.Notes]
            }
            countOps = { where: { status: 'published' }, include: [{ model: db.Tags, where: { slug: tag } }] }

        }



        let posts = await db.Posts.findAll(queryOps);
        let count = await db.Posts.count(countOps)
        return { status: true, data: { posts, count } }
    } catch (err) {
        console.log(err);
        return { status: false, err };
    }

}

async function getAll() {
    return await db.Posts.findAll();
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

async function incViewsOfPost({ slug }) {
    db.Posts.increment('views', { where: { slug } });
}

async function get({ slug }) {
    try {
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
    } catch (err) {
        console.log(err);
    }

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
        if (SubCate === 'all') {
            let allSubCateIds = await db.EditorCategories.findAll({ raw: true, attributes: ['SubCategoryId'], where: { UserId: EditorId } });
            allSubCateIds = allSubCateIds.map(aS => aS.SubCategoryId);
            let posts = await db.Posts.findAll({
                where: {
                    status: 'pending',
                    SubCategoryId: allSubCateIds
                },
                limit: limit,
                offset: offset,
                include: [
                    db.MainCategories,
                    db.SubCategories,
                    db.Users,
                    db.Tags,
                ]
            })
            let count = await db.Posts.count({
                where: {
                    status: 'pending',
                    SubCategoryId: allSubCateIds
                }
            });

            return {
                posts, count
            }
        } else {
            let allSubCateIds = await db.SubCategories.findAll({
                // raw: true,
                attributes: ['id'],
                where: { slug: SubCate },
                include: [{
                    attributes: ['id'],
                    model: db.Users,
                    where: {
                        id: EditorId
                    }
                }]
            });
            let subCateId = allSubCateIds[0].id;
            let posts = await db.Posts.findAll({
                where: {
                    status: 'pending',
                    SubCategoryId: subCateId
                },
                limit: limit,
                offset: offset,
                include: [
                    db.MainCategories,
                    db.SubCategories,
                    db.Users,
                    db.Tags,
                ]
            })
            let count = await db.Posts.count({
                where: {
                    status: 'pending',
                    SubCategoryId: subCateId
                }
            });
            return {
                posts, count
            }
        }
    } catch (err) {
        console.log({ err });
    }
}

async function publishPost({ id }) {
    return db.Posts.update(
        {
            status: 'published'
        },
        {
            where: {
                id: id,
                status: 'verified'
            }
        }
    );
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

async function addCommentToPost({ PostId, commentContent, UserId }) {
    return db.Comments.create({
        PostId,
        commentContent,
        UserId,
        commentDate: new Date()
    })
}

async function getDetailPost({ slug }) {
    try {
        await incViewsOfPost({ slug });
        return db.Posts.findOne({
            where: {
                slug,
                status: 'published'
            },
            include: [
                db.MainCategories,
                db.SubCategories,
                db.Users,
                db.Tags,
                {
                    model: db.Comments,
                    attributes: ['commentContent', 'commentDate', 'PostId', 'UserId'],
                    limit: 5,
                    order: [['commentDate', 'DESC']],
                    include: [
                        {
                            attributes: ['username', 'email'],
                            model: db.Users,
                        }
                    ]
                }
            ]
        });;
    } catch (err) {
        console.log(err);
    }
}

async function loadMoreComment({ PostId, offset, limit }) {
    return db.Comments.findAll({
        where: {
            PostId,
        },
        limit,
        offset,
        order: [['commentDate', 'DESC']],
        include: [
            {
                attributes: ['username', 'email'],
                model: db.Users,
            }
        ]
    })
}

async function search({ searchStr, offset, limit }) {
    console.log("==========================")
    console.log("seachStr =>_" + searchStr);
    console.log("==========================")
    try {
        searchStr = `%${searchStr}%`;
        let query = {
            [Op.or]: [
                {
                    content: {
                        [Op.iLike]: searchStr
                    }
                },
                {
                    shortContent: {
                        [Op.iLike]: searchStr
                    }
                },
                {
                    title: {
                        [Op.iLike]: searchStr
                    }
                }
            ]
        };
        let posts = await db.Posts.findAll({
            where: query,
            limit,
            offset,
            include: [
                db.MainCategories,
                db.SubCategories,
                db.Users,
                db.Tags,
            ]
        });

        let count = await db.Posts.count({
            where: query,
        });
        return { posts, count };
    } catch (err) {
        throw err;
    }
}

function getNextWeekDate() {
    let now = new Date();
    return new Date(now.getTime() + 7 * 24 * 3600 * 1000);
}

function noticeablePosts() {
    let nextWeek = getNextWeekDate();
    console.log("==============DATA=============");
    console.log(nextWeek);
    console.log("=============DATA================");
    return db.Posts.findAll({
        where: {
            [Op.and]: [
                {
                    releaseDate: {
                        [Op.lte]: nextWeek,
                        // [Op.gte]: new Date()
                    },
                    status: 'published'
                }
            ],
        },
        order: [
            ['views', 'DESC']
        ],
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
            db.Tags,
        ],
        limit: 4
    });
}

function mostViewsPosts() {
    return db.Posts.findAll({
        where: {
            releaseDate: {
                [Op.lte]: new Date()
            }
        },
        order: [
            ['views', 'DESC']
        ],
        limit: 10,
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
            db.Tags,
        ],
    });
}

function latestPosts() {
    return db.Posts.findAll({
        where: {
            releaseDate: {
                [Op.lte]: new Date()
            }
        },
        order: [
            ['releaseDate', 'DESC']
        ],
        limit: 10,
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
            db.Tags,
        ],
    });
}

async function newPostByHotCats() {
    try {
        // let subCats = await db.SubCategories.findAll({
        //     attributes: ['name', 'id', [sequelize.fn('SUM', sequelize.col('Posts.views')), 'totalViews']],
        //     group: ['SubCategories.id'],
        //     include: [
        //         {
        //             attributes: [],
        //             model: db.Posts, 
        //         }
        //     ],
        //     //limit: 10,
        //     //order: sequelize.literal('totalViews DESC'),
        //     raw: true,


        //     // attributes: [
        //     //     'name', 'id'
        //     // ],
        //     // limit: 10,
        //     // order:[
        //     //     ['createdAt', 'ASC']
        //     // ],
        //     // raw: true, 

        // })
        let query = `SELECT  "SubCategories"."name", "SubCategories"."id", coalesce(SUM("Posts"."views"), 0) AS "totalViews" 
        FROM "SubCategories" AS "SubCategories" LEFT OUTER JOIN "Posts" AS "Posts" ON "SubCategories"."id" = "Posts"."SubCategoryId" 
        GROUP BY "SubCategories"."id"
        ORDER BY "totalViews" desc
        LIMIT 10`;
        let subCats = await db.sequelize.query(query, { type: QueryTypes.SELECT })
        let ids = subCats.map(s => s.id);
        return db.Posts.findAll({
            where: {
                releaseDate: {
                    [Op.lte]: new Date()
                }
            },
            order: [
                ['releaseDate', 'DESC']
            ],
            limit: 10,
            include: [
                db.MainCategories,
                {
                    model: db.SubCategories,
                    where: {
                        id: ids
                    }
                },
                db.Users,
                db.Tags,
            ],
        });

    } catch (err) {
        throw err;
    }
}

async function geRandomPostsWithSameCategory({ slug, limit }) {
    let currentPost = await db.Posts.findOne({
        raw: true,
        attributes: ['id', 'slug', 'SubCategoryId'],
        where: {
            slug
        }
    })
    return db.Posts.findAll({
        order: [
            [sequelize.fn('RANDOM')]
        ],
        limit,
        where: {
            [Op.and]: [
                {
                    SubCategoryId: currentPost.SubCategoryId
                },
                {
                    id: { [Op.notIn]: [currentPost.id] }
                }
            ],
        },
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
        ]
    })
}

async function getRandomPosts({ limit, slug }) {
    return db.Posts.findAll({
        order: [
            [sequelize.fn('RANDOM')]
        ],
        limit,
        where: {
            slug: { [Op.notIn]: [slug] }
        },
        include: [
            db.MainCategories,
            db.SubCategories,
            db.Users,
        ]
    })
}

async function deleteById(id){
    await tagService.removeTagsOfPost({ postId:id });
    return db.Posts.destroy({
        where: {
            id
        }
    })
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
    getAllPosts,
    incViewsOfPost,
    addCommentToPost,
    getDetailPost,
    loadMoreComment,
    search,
    getAll,
    publishPost,
    noticeablePosts,
    mostViewsPosts,
    latestPosts,
    newPostByHotCats,
    geRandomPostsWithSameCategory,
    getRandomPosts,
    deleteById
};