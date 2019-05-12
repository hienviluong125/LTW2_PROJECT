// ==============START writers/posts/add ========================
var quill = null;
var allCategories = [];
var formData = null;

//create tag DOM
function createTags(label) {
    let spanLabel = $("<span/>").html(label);
    let removeIcon = $("<i/>", { class: 'ion-close-round tag-close-btn' });
    $("<div/>", { class: 'tags' })
        .append(spanLabel)
        .append('&ensp;')
        .append(removeIcon)
        .insertBefore($('.tag-input'));

}

//add tag event
function addTagEvent() {
    $('.tag-input')
        .focus(function (e) {
            $(this).parent().addClass('tag-input-focus');
        })
        .blur(function (e) {
            $(this).parent().removeClass('tag-input-focus');
        })
        .keypress(function (e) {
            let that = $(this);
            if (e.keyCode == '13') {
                e.preventDefault();
                let label = that.val();
                if (isTagAlreadyExist(label) && label.length > 0 && label.trim().length > 0) {
                    createTags(label);
                    that.val('');
                }
            }
        })

}

function getAllTagsValue() {
    let tags = [];
    $('.tags').each(function () {
        let label = $(this).find('span').text();
        if (label.length > 0) {
            tags.push(label);
        }
    });
    return tags;
}

//check tag before add
function isTagAlreadyExist(inputLabel) {
    flag = true;
    $('.tags').each(function () {
        let label = $(this).find('span').text();
        if (label === inputLabel) {
            flag = false;
        }
    });
    return flag;
}

//remove tag
function closeTagEvent() {
    $('.tags-container').on('click', 'i.tag-close-btn', function (e) {
        $(this).parent().remove();
    })
}


//quill editor initial
function initQuillEditor() {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Viết bài tại đây...',
        modules: {
            imageResize: {
                modules: ['Resize', 'DisplaySize']
            },
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ align: '' }],
                [{ align: 'right' }],
                [{ align: 'center' }],
                [{ align: 'justify' }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        }
    });
}

//quill editor focus effect
function initQuillEditorEvent() {

    $('.ql-editor')
        .focus(function (e) {
            $('.ql-toolbar').addClass('ql-toolbar-focus');
            $('.ql-container').addClass('ql-container-focus');
        })
        .blur(function (e) {
            $('.ql-toolbar').removeClass('ql-toolbar-focus');
            $('.ql-container').removeClass('ql-container-focus');
        })
}

//choose image from button
function initThumbnailButtonClick() {
    // '#file').trigger('click');
    $('.thumbnail-btn').on('click', function () {
        $('#thumbnail').trigger('click');
    })

    $("#thumbnail").change(function () {
        readURL(this);
    });


}

//preview image handler
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.post-thumbnail-name').val(input.files[0].name);
            $('.post-thumbnail-image').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

//check quill editor content is empty ?
function isQuillEmpty(quill) {
    return quill.getText().trim().length <= 20 && quill.container.firstChild.innerHTML.includes("img") === false;
}

//Main cate - sub cate handler
function mainCateSelect() {
    $('#main-cate').on('change', function (e) {
        let valueSelected = this.value;
        let subCates = allCategories.find(aC => aC.id === parseInt(valueSelected)).SubCategories;
        console.log("allCategories",allCategories);
        $('#sub-cate')
            .html('')
            .append($('<option>', {
                value: "",
                text: "Chọn chuyên mục",
                disabled: true
            }));

        for (let cate of subCates) {
            $('#sub-cate').append($('<option>', {
                value: cate.id,
                text: cate.name
            }));
        }
    });
}

// convert base64/URLEncoded data component to raw binary data held in a string
function dataURItoBlob(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

function appendImgsToFormData(formData, data, slug) {
    let delta = data.delta;
    let index = 0;
    for (let o of delta.ops) {
        if (typeof o.insert.image !== 'undefined') {
            let imgBlob = dataURItoBlob(o.insert.image);
            let imgName = imgBlob.type.replace('image/', '');
            let imgId = slug + '-' + index.toString() + '.' + imgName;
            formData.append('images', imgBlob, imgId);
            o.insert = { image: imgId }
            index++;
        }
    }

    let thumbnailImage = $('.post-thumbnail-image').attr('src');
    let thumbnailImgBlob = dataURItoBlob(thumbnailImage);
    let thumbnailImgName = thumbnailImgBlob.type.replace('image/', '');
    let thumbnailImgId = slug + '-' + index.toString() + '.' + thumbnailImgName;

    let postData = {
        title: data.title,
        shortContent: data.shortContent,
        slug: data.slug,
        MainCategoryId: data.mainCate,
        SubCategoryId: data.subCate,
        content: data.delta,
        tags: data.tags,
        thumbnail: thumbnailImgId
    }


    formData.append('images', thumbnailImgBlob, thumbnailImgId);
    formData.append("data", JSON.stringify(postData));

    console.log("JSON.stringify(postData)",JSON.stringify(postData));
}

//validate input data
function validateAddPostForm() {
    //reset all invalid alert display false
    $('.invalid-feedback').css('display', 'none');
    let isAllow = true;
    let title = $('#title')
    let thumbnailName = $('#thumbnail-name')
    let shortContent = $('#short-content')
    let delta = quill.getContents();
    let mainCate = parseInt($('#main-cate option:selected').val());
    let subCate = parseInt($('#sub-cate option:selected').val());
    let tags = getAllTagsValue();
    // console.log(tags);
    // let content = quill.getContents();

    if (title.val().length < 10) {
        let invalidId = `${title.attr('id')}-invalid`;
        $('#' + invalidId).css('display', 'block');
        isAllow = false;
    }
    if (shortContent.val().length < 10) {
        let invalidId = `${shortContent.attr('id')}-invalid`;
        $('#' + invalidId).css('display', 'block');
        isAllow = false;
    }
    if (thumbnailName.val().length <= 0) {
        let invalidId = `${thumbnailName.attr('id')}-invalid`;
        $('#' + invalidId).css('display', 'block');
        isAllow = false;
    }
    if (isQuillEmpty(quill)) {
        let invalidId = `content-invalid`;
        $('#' + invalidId).css('display', 'block');
        isAllow = false;
    }


    if (isAllow) {
        //if data condition OK => popup confirm modal

        formData = new FormData($('#add-post-form')[0]);
        let slug = str_to_slug(title.val());
        let data = {
            title: title.val(),
            shortContent: shortContent.val(),
            slug,
            mainCate,
            subCate,
            tags,
            delta
        }

        appendImgsToFormData(formData, data, slug);
        showModal({ id: 'add-post-confirm-modal' });
        submitPost(formData);

    } else {
        $('html, body').animate({
            scrollTop: 0
        }, 250);
    }




}

//submit data button click event
function submitButtonClicked() {
    $('#submit-post-btn').on('click', function (e) {
        e.preventDefault();
        validateAddPostForm();

    })
}

function submitPost(formData) {
    $('.accept-btn').on('click', function (e) {
        hideModal({ id: 'add-post-confirm-modal' });
        showModal({ id: 'add-post-loading-modal', backdrop: 'static', keyboard: false });

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: `${API_URL}/writers/posts/add`,
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                setTimeout(function () {
                    hideModal({ id: 'add-post-loading-modal' });
                    showModal({ id: 'add-post-success-modal', backdrop: 'static', keyboard: false });
                }, 500)


            },
            error: function (error) {
                // console.log(error);
                setTimeout(function () {
                    hideModal({ id: 'add-post-loading-modal' });
                    showModal({ id: 'add-post-failure-modal', backdrop: 'static', keyboard: false });
                }, 500)
            }
        });

    })
}


//MAIN
//this function init all event for add post page
function initAddPostPageEvent() {

    var title = "Thông báo";
    var content = `Bạn có chắc chắn muốn đăng tải bài viết này hay không ?
    Nếu đăng tải sẽ cần phải chờ một khoảng thời gian kiểm duyệt từ quản trị viên`;
    var linkTo = "writers/posts";
    initConfirmModal("add-post-confirm-modal", title, content);
    initLoadingModal("add-post-loading-modal");
    initSuccessModal("add-post-success-modal", linkTo);
    initFailureModal("add-post-failure-modal");

    allCategories = $('#main-categories').html();
    if(allCategories && typeof allCategories !== 'undefined'){
        allCategories = JSON.parse(allCategories);
    }
   
    initQuillEditor();
    initQuillEditorEvent()
    addTagEvent();
    closeTagEvent();
    initThumbnailButtonClick();
    mainCateSelect();
    submitButtonClicked();
    // submitPost();

}

