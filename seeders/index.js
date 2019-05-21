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

(async function () {

    await db.Writers.destroy({ where: {} });
    await db.Subscribers.destroy({ where: {} });

    await db.EditorCategories.destroy({ where: {} });
    await db.Editors.destroy({ where: {} });


    await db.PostTags.destroy({ where: {} });
    await db.Posts.destroy({ where: {} });
    await db.Tags.destroy({ where: {} });


    await db.SubCategories.destroy({ where: {} });
    await db.MainCategories.destroy({ where: {} });


    await db.Users.destroy({ where: {} });




    //tạo category
    await seedCategory();
    //tạo user
    // aaa ,bbb, ccc Writer
    //ddd fff ggg Subscriber
    await seedUsers();

    //tạo posts cho 3 user aaa,bbb,ccc
    await seedPosts('aaa@gmail.com','Tài chính');
    await seedPosts('bbb@gmail.com','Âm nhạc');
    await seedPosts('ccc@gmail.com','Nhân vật');


    //tạo editor
    // xxx yyy zzz
    await seedEditor();

    // tạo editor sub category - editor quản lý chuyên mục
    await seedEditorCategory('xxx@gmail.com', 'Trải nghiệm')
    await seedEditorCategory('yyy@gmail.com', 'Âm nhạc');
    await seedEditorCategory('zzz@gmail.com', 'Nhân vật');

    // await seedUsers





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
            name: "Công nghệ",
            _subCates: [{ name: "Trải nghiệm", }, { name: "Thị trường", }, { name: "Thủ thuật", }
            ]
        },
        {
            name: "Kinh doanh",
            _subCates: [
                { name: "Tài chính", }, { name: "Doanh nghiệp", }, { name: "Mua sắm", }, { name: "Đầu tư", }
            ]
        },
        {
            name: "Giải trí",
            _subCates: [
                {
                    name: "Âm nhạc",
                },
                {
                    name: "Điện ảnh",
                },
                {
                    name: "TV Show",
                },
                {
                    name: "Thời trang",
                },
                {
                    name: "Hậu trường",
                }
            ]
        },
        {
            name: "Văn hóa",
            _subCates: [
                {
                    name: "Nhân vật",
                },
                {
                    name: "Sàn diễn",
                },
                {
                    name: "Sách",
                },
                {
                    name: "Đời sống"
                }
            ]
        },
        {
            name: "Khoa học",
            _subCates: [
                {
                    name: "Thường thức",
                },
                {
                    name: "Phát minh",
                }

            ]
        },

    ]

    await MainCategories.destroy({
        where: {}
    });

    for (let maincate of _mainCates) {
        MainCategories.create({
            name: maincate.name,
            slug: str_to_slug(maincate.name)
        }).then(result => {
            console.log("Tạo main " + maincate.name + " thanh công");
            let id = result.dataValues.id;
            for (let subCate of maincate._subCates) {
                SubCategories.create({
                    name: subCate.name,
                    slug: str_to_slug(subCate.name),
                    MainCategoryId: id
                }).then(() => console.log("Tạo sub " + subCate.name + " thanh công"));
            }
        })
    }
}

async function seedUserWithId(id,email){
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
        let id = userResult.dataValues.id
        return await db.Writers.create({ PenName: e + '@gmail.com', UserId: id });

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

