const db = require('./../models/index');
const MainCategories = db.MainCategories;
const SubCategories = db.SubCategories;
const Posts = db.Posts;
const bcrypt = require('bcrypt');
const crypto = require('./../config/crypto');
const postsService = require('./../services/postsService');
const faker = require('faker');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function str_to_slug(slug) {

    slug = slug.toLowerCase();

    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');

    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');

    slug = slug.replace(/ /gi, "-");

    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');

    return slug;
}

async function creatTags({ tags }) {
    return await Promise.all(tags.map(n => {
        return db.Tags.findOrCreate({
            where: {
                name: n
            },
            defaults: {
                name: n
            }
        })
    }));
}

const randomImgs = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg'];

async function seed() {
    await db.Writers.destroy({ where: {} });
    await db.Subscribers.destroy({ where: {} });

    await db.EditorCategories.destroy({ where: {} });
    await db.Editors.destroy({ where: {} });


    await db.PostTags.destroy({ where: {} });
    await db.Posts.destroy({ where: {} });
    await db.Tags.destroy({ where: {} });


    await db.SubCategories.destroy({ where: {} });
    await db.MainCategories.destroy({ where: {} });

    await db.Admins.destroy({ where: {} });
    await db.Users.destroy({ where: {} });

    //tạo category
    await seedCategory();
    //tạo user
    // aaa ,bbb, ccc Writer
    //ddd fff ggg Subscriber
    await seedUsers();

    //tạo posts cho 3 user aaa,bbb,ccc
    // await seedPosts('aaa@gmail.com','Tài chính');
    // await seedPosts('bbb@gmail.com','Âm nhạc');
    // await seedPosts('ccc@gmail.com','Nhân vật');


    //tạo editor
    // xxx yyy zzz
    await seedEditor();

    // tạo editor sub category - editor quản lý chuyên mục
    await seedEditorCategory('xxx@gmail.com', 'Trải nghiệm')
    await seedEditorCategory('xxx@gmail.com', 'Thị trường')

    await seedEditorCategory('yyy@gmail.com', 'Tài chính');
    await seedEditorCategory('yyy@gmail.com', 'Doanh nghiệp');

    await seedEditorCategory('zzz@gmail.com', 'Âm nhạc');
    await seedEditorCategory('zzz@gmail.com', 'Điện ảnh');
}

(async function () {

    // await seed();
    // await seedUserWithId(99,'succc');
    // await seedUserWithId(10,'minhduccc');
    // await seedUserWithId(78,'daniel_kox');


    // await db.Posts.update({
    //     releaseDate: new Date(),
    //     status: 'published'
    // },{
    //     where : {
    //         status: 'pending'
    //     }
    // })


    // let ids = await db.Posts.findAll({ raw: true, attributes: ['id'] });

    // await Promise.all(ids.map(async _id => {
    //     let rd = getRandomInt(100,1000);
    //     return await db.Posts.update({
    //         views: rd
    //     }, {
    //             where: {
    //                 id: _id.id
    //             }
    //         })
    // }))


    //let ids = await db.

    // let ids = await db.Posts.findAll({
    //     raw: true,
    //     attributes: ['id','WriterId'],
    //     where : {
    //         SubCategoryId:[183,184]
    //     }
    // });

    // await Promise.all(ids.map(s => {
    //     try{
    //         return db.Notes.create({
    //             WriterId: s.WriterId,
    //             PostId: s.id,
    //             status: 'verified',
    //             EditorId: 7
    //         })
    //     }catch(err){
    //         console.log({err});
    //     }
        
    // }))

    // console.log({ids,length: ids.length})
   









})()

async function seedPosts(username, subcatename) {
    let userInfo = await db.Users.findOne({ where: { username } }, { raw: true });
    let WriterId = userInfo.id;

    let subCateInfo = await db.SubCategories.findOne({ where: { name: subcatename } }, { raw: true });
    let SubCategoryId = subCateInfo.id;
    let MainCategoryId = subCateInfo.MainCategoryId;
    for (let index = 0; index < 85; index++) {
        var deltaOps = "";

        let title = faker.name.title()
        await postsService.add({
            WriterId: WriterId,
            title,
            shortContent: faker.lorem.sentence(),
            slug: str_to_slug(title),
            MainCategoryId,
            SubCategoryId,
            content: JSON.stringify(JSON.parse(JSON.stringify(deltaOps))),
            tags: [faker.name.jobType(), faker.name.jobType(), faker.name.jobType()],
            thumbnail: randomImgs[getRandomInt(0, 4)]
        })
    }
}

async function seedCategory() {
    var _mainCates = [
        {
            id: 46,
            name: "Công nghệ",
            _subCates: [{ id: 163, name: "Trải nghiệm", }, { id: 164, name: "Thị trường", }
            ]
        },
        {
            id: 47,
            name: "Kinh doanh",
            _subCates: [
                { id: 173, name: "Tài chính", }, { id: 174, name: "Doanh nghiệp" }
            ]
        },
        {
            id: 48,
            name: "Giải trí",
            _subCates: [
                {
                    id: 183,
                    name: "Âm nhạc",
                },
                {
                    id: 184,
                    name: "Điện ảnh",
                }
            ]
        }

    ]

    await MainCategories.destroy({
        where: {}
    });

    for (let maincate of _mainCates) {
        MainCategories.create({
            id: maincate.id,
            name: maincate.name,
            slug: str_to_slug(maincate.name)
        }).then(result => {
            console.log("Tạo main " + maincate.name + " thanh công");
            let id = result.dataValues.id;
            for (let subCate of maincate._subCates) {
                SubCategories.create({
                    id: subCate.id,
                    name: subCate.name,
                    slug: str_to_slug(subCate.name),
                    MainCategoryId: id
                }).then(() => console.log("Tạo sub " + subCate.name + " thanh công"));
            }
        })
    }
}

async function seedSpecialWriters() {
    const emails1 = ['alex', 'john', 'marry'];
    await Promise.all(emails1.map(async e => {
        let _id =
            e === 'alex'
                ? 99
                : e === 'john' ? 121 : 10;
        let hash = await bcrypt.hash(e + e, crypto.iteration)
        let userResult = await db.Users.create({
            username: e + '@gmail.com',
            id: _id,
            email: e + '@gmail.com',
            password: hash,
            role: 'writer'
        });
        let id = userResult.dataValues.id
        return await db.Writers.create({ PenName: e + '@gmail.com', UserId: id });

    }))
}

async function seedUserWithId(id, email) {
    const emails1 = [email];
    await Promise.all(emails1.map(async e => {
        let hash = await bcrypt.hash(e + e, crypto.iteration)
        let userResult = await db.Users.create({
            username: e + '@gmail.com',
            email: e + '@gmail.com',
            password: hash,
            role: 'writer',
            id
        });
        let u_id = userResult.dataValues.id
        return await db.Writers.create({ PenName: e + '@gmail.com', UserId: u_id });

    }))
}

async function seedUsers() {
    const emails1 = ['aaa', 'bbb', 'ccc'];
    await Promise.all(emails1.map(async e => {
        let hash = await bcrypt.hash(e + e, crypto.iteration)
        let userResult = await db.Users.create({
            username: e + '@gmail.com',
            email: e + '@gmail.com',
            password: hash,
            role: 'writer'
        });
        let id = userResult.dataValues.id
        return await db.Writers.create({ PenName: e + '@gmail.com', UserId: id });

    }))

    const emails2 = ['ddd', 'fff', 'ggg'];
    await Promise.all(emails2.map(async e => {
        let hash = await bcrypt.hash(e + e, crypto.iteration)
        let userResult = await db.Users.create({
            username: e + '@gmail.com',
            email: e + '@gmail.com',
            password: hash,
            role: 'sub'
        });
        let id = userResult.dataValues.id
        return await db.Subscribers.create({ UserId: id });
    }))

    let hashAdmin = await bcrypt.hash('admin123456', crypto.iteration)
    let adminResult = await db.Users.create({
        id: 169,
        username: 'admin@gmail.com',
        email: 'admin@gmail.com',
        password: hashAdmin,
        role: 'admin'
    })

    await db.Admins.create({ UserId: 169 });

}


async function seedEditor() {
    const emails1 = ['xxx', 'yyy', 'zzz'];
    await Promise.all(emails1.map(async e => {
        let hash = await bcrypt.hash(e + e, crypto.iteration)
        let userResult = await db.Users.create({
            username: e + '@gmail.com',
            email: e + '@gmail.com',
            password: hash,
            role: 'editor'
        });
        let id = userResult.dataValues.id
        return await db.Editors.create({ UserId: id });

    }))
}

async function seedEditorCategory(username, subcatename) {
    let userInfo = await db.Users.findOne({ where: { username } }, { raw: true });
    let UserId = userInfo.id;

    let subCateInfo = await db.SubCategories.findOne({ where: { name: subcatename } }, { raw: true });
    let SubCategoryId = subCateInfo.id;
    return db.EditorCategories.create({
        UserId, SubCategoryId
    })
}

