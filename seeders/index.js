const db = require('./../models/index');
const MainCategories = db.MainCategories;
const SubCategories = db.SubCategories;
const Posts = db.Posts;
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

(async function () {

    // await db.Tags.destroy({where:{}});
    // await db.Posts.destroy({where:{}})
    seedCategory();





})()


async function seedCategory() {
    var _mainCates = [
        {
            name: "Công nghệ",
            _subCates: [
                {
                    name: "Trải nghiệm",
                },
                {
                    name: "Thị trường",
                },
                {
                    name: "Thủ thuật",
                }
            ]
        },
        {
            name: "Kinh doanh",
            _subCates: [
                {
                    name: "Tài chính",
                },
                {
                    name: "Doanh nghiệp",
                },
                {
                    name: "Mua sắm",
                },
                {
                    name: "Đầu tư",
                }
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