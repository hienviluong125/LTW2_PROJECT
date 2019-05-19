var API_URL = 'http://localhost:4200';
$(document).ready(function () {

    initCarousel();
    initAddPostPageEvent();
    initPostListPageEvent();
    initEditPostPageEvent();
    initVerifyPostPageEvent();
    $('.prevent-btn').on('click', function (e) {
        e.preventDefault();
        let id = $(this).data('id');
        showModal({ id: 'modal-centered-' + id });
    })

    let delta = $('#post-detail').html();
    
    let inputDelta = JSON.parse(delta);
    let contentHtml = quillGetHTML(inputDelta);
    
    $('#post-detail').html(contentHtml).css('display','block');


});

function quillGetHTML(inputDelta) {
    var tempQuill = new Quill(document.createElement("div"));
    // tempQuill = new Quill('#post-quill-detail', {
    //     theme: 'snow',
    //     placeholder: 'Viết bài tại đây...',
    //     modules: {
    //         imageResize: {
    //             modules: ['Resize', 'DisplaySize']
    //         },
    //         toolbar: [
    //             [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    //             ['bold', 'italic', 'underline', 'strike'],
    //             [{ 'color': [] }, { 'background': [] }],
    //             [{ align: '' }],
    //             [{ align: 'right' }],
    //             [{ align: 'center' }],
    //             [{ align: 'justify' }],
    //             ['link', 'image', 'video'],
    //             ['clean']
    //         ]
    //     }
    // });
    tempQuill.setContents(inputDelta);
    return tempQuill.root.innerHTML;
}

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
        loop: false,
        margin: 10,
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