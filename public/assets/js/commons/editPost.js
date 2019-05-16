var quil2 = null;
//validate input data
function validateEditPostForm() {
    //reset all invalid alert display false
    $('.invalid-feedback').css('display', 'none');
    let isAllow = true;
    let title = $('#title')
    let thumbnailName = $('#thumbnail-name')
    let shortContent = $('#short-content')
    let delta = quill2.getContents();
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
    if (isQuillEmpty(quill2)) {
        let invalidId = `content-invalid`;
        $('#' + invalidId).css('display', 'block');
        isAllow = false;
    }


    if (isAllow) {
        //if data condition OK => popup confirm modal

        formData = new FormData($('#edit-post-form')[0]);
        let slug = str_to_slug(title.val());
        let id = $('.hidden_id').val();
        id = parseInt(id);
        let data = {
            title: title.val(),
            shortContent: shortContent.val(),
            slug,
            mainCate,
            subCate,
            tags,
            delta,
            id
        }

        appendImgsToEditFormData(formData, data, slug);
        showModal({ id: 'edit-post-confirm-modal' });
        submitEditPost(formData);

    } else {
        $('html, body').animate({
            scrollTop: 0
        }, 250);
    }




}

//submit data button click event
function submitEditButtonClicked() {
    $('#edit-post-btn').on('click', function (e) {
        e.preventDefault();
        validateEditPostForm();

    })
}

function submitEditPost(formData) {
    $('.accept-btn').on('click', function (e) {
        hideModal({ id: 'edit-post-confirm-modal' });
        showModal({ id: 'edit-post-loading-modal', backdrop: 'static', keyboard: false });

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: `${API_URL}/writers/posts/edit`,
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                setTimeout(function () {
                    hideModal({ id: 'edit-post-loading-modal' });
                    let linkTo = "writers/posts";
                    initSuccessModal("edit-post-success-modal", linkTo);
                    showModal({ id: 'edit-post-success-modal', backdrop: 'static', keyboard: false });
                }, 500)


            },
            error: function (error) {
                let { responseJSON } = error;
                console.log(responseJSON.err);
                setTimeout(function () {
                    hideModal({ id: 'edit-post-loading-modal' });
                    initFailureModal("edit-post-failure-modal",responseJSON.err);
                    showModal({ id: 'edit-post-failure-modal', backdrop: 'static', keyboard: false });
                }, 500)
            }
        });

    })
}

function appendImgsToEditFormData(formData, data, slug) {
    let delta = data.delta;
    let index = 0;
    for (let o of delta.ops) {
        if (typeof o.insert.image !== 'undefined' && o.insert.image.indexOf('base64') !== -1) {
            let imgBlob = dataURItoBlob(o.insert.image);
            let imgName = imgBlob.type.replace('image/', '');
            let imgId = '/assets/img/posts/' + slug + '-' + index.toString() + '.' + imgName;
            formData.append('images', imgBlob, imgId);
            o.insert = { image: imgId }
            index++;
        }
    }

    let thumbnailImage = $('.post-thumbnail-image').attr('src');
    let thumbnailImgId = "";

    if (thumbnailImage.indexOf('base64') !== -1) {
        //là base64
        let thumbnailImgBlob = dataURItoBlob(thumbnailImage);
        let thumbnailImgName = thumbnailImgBlob.type.replace('image/', '');
        thumbnailImgId = slug + '-' + index.toString() + '.' + thumbnailImgName;

        formData.append('images', thumbnailImgBlob, thumbnailImgId);
    } else {
        //không là base64 - hình ảnh không đc thay đổi
        thumbnailImgId = $('#thumbnail-name').val();
    }



    let postData = {
        id: data.id,
        title: data.title,
        shortContent: data.shortContent,
        slug: data.slug,
        MainCategoryId: data.mainCate,
        SubCategoryId: data.subCate,
        content: data.delta,
        tags: data.tags,
        thumbnail: thumbnailImgId
    }

    formData.append("data", JSON.stringify(postData));
}

function initQuillEditEditor(deltaObj) {
    if (!isEmpty($('#edit-editor-container'))) {
        quill2 = new Quill('#edit-editor-container', {
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

        quill2.setContents(JSON.parse(deltaObj));
    }
}

function initEditPostPageEvent() {
    let title = "Thông báo";
    let content = `Bạn có chắc chắn muốn chỉnh sửa bài viết này hay không ?
    Nếu chỉnh sửa sẽ cần phải chờ một khoảng thời gian kiểm duyệt từ quản trị viên`;
  

    initConfirmModal("edit-post-confirm-modal", title, content);
    initLoadingModal("edit-post-loading-modal");
   
   
    submitEditButtonClicked();
    let deltaContent = $('#delta-content').html();
    if (deltaContent && typeof deltaContent !== 'undefined') {
        initQuillEditEditor(deltaContent);
    }






}