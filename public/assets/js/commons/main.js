var API_URL = 'http://localhost:4200';
$(document).ready(function () {

    initCarousel();
    initAddPostPageEvent();
    initPostListPageEvent();
    initEditPostPageEvent();
    initVerifyPostPageEvent();

    initPostDetailPage();

    $("body").click(function (e) {
        if (e.target.nodeName !== 'INPUT' && e.target.className.indexOf("ti-search") === -1) {
            if ($('.ti-search').data('toggle')) {
                $('.ti-search').parent().addClass('bg-none').data('toggle', false);
                $('.search-input').css({ "display": "none" });
            }

        }
    });

    $('.ti-search').click(function () {
        $(this).data('toggle', true);
        $(this).parent().removeClass('bg-none');
        $('.search-input').css({
            "display": "block",
        })
        // $('.search-input').animate({left: '+='+500}, 500);
    })

});



function initEventWithRouter(param) {

}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function initCarousel() {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

    $('.post-detai-recommend').owlCarousel({
        loop: false,
        margin: 10,
        mouseDrag: false,
        touchDrag: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
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