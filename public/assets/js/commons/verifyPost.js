function initVerifyPostPageEvent() {
    let deltaContent = $('#delta-content').html();
    if (deltaContent && typeof deltaContent !== 'undefined') {
        initQuillVerifyEditor(deltaContent);
    }
    openVerifyForm();
}

function initQuillVerifyEditor(deltaObj) {
    if (!isEmpty($('#verify-editor-container'))) {
        let quill = new Quill('#verify-editor-container', {
            theme: 'snow',
            placeholder: 'Viết bài tại đây...',
            readOnly: true,
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

        quill.setContents(JSON.parse(deltaObj));
    }
}

function openVerifyForm() {
    $('#verify-post-btn').on('click', function (e) {
        e.preventDefault();
        let title = "Thông báo";
        let content = `Bạn có chắc chắn muốn phê duyệt bài viết này hay không ?
        Bài viết đã phê duyệt sẽ không thể thay đổi`;
        let linkTo = window.location.href.indexOf('admin') !== -1  ? 'admin/posts': 'editors/posts/all/all/1';

        initConfirmModal("verify-post-confirm-modal", title, content);
        initLoadingModal("verify-post-loading-modal");
        initSuccessModal("verify-post-success-modal", linkTo);
        initFailureModal("verify-post-failure-modal");

        showModal({ id: 'verify-post-confirm-modal' });

        $('.accept-btn').on('click', function (e) {
            e.preventDefault();
            verifySubmit();

        })
    });

}

function verifySubmit() {

    hideModal({ id: 'verify-post-confirm-modal' });
    showModal({ id: 'verify-post-loading-modal', backdrop: 'static', keyboard: false });
    let releaseDate = $('#date').val();
    let tags = getAllTagsValue();
    let MainCategoryId = parseInt($('#main-cate option:selected').val());
    let SubCategoryId = parseInt($('#sub-cate option:selected').val());
    let PostType = $('#post-type option:selected').val();
    let PostId = $('.hidden_id').val();
    let WriterId = parseInt($('.post-user-id').val());
    let prevRouter = $('.prevRouter').val();
    prevRouter = prevRouter.length > 0 ? prevRouter : `${API_URL}/editors/posts/all/1`
    let dataParam = {
        releaseDate,
        tags,
        MainCategoryId,
        SubCategoryId,
        PostType,
        PostId,
        prevRouter,
        WriterId
    };

    $.ajax({
        type: "POST",
        url: `${API_URL}/editors/posts/verify`,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dataParam),
        success: function (data) {
            setTimeout(function () {
                hideModal({ id: 'verify-post-loading-modal' });
                showModal({ id: 'verify-post-success-modal', backdrop: 'static', keyboard: false });
            }, 500)


        },
        error: function (error) {
            setTimeout(function () {
                hideModal({ id: 'verify-post-loading-modal' });
                showModal({ id: 'verify-post-failure-modal', backdrop: 'static', keyboard: false });
            }, 500)
        }

    })
}