function initConfirmModal(id, title, content) {
    var modalDom =
        `     
    <div id=${id} class="modal fade">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">${title}</h4>
                    <button type="button" class="close" data-dismiss="modal">
                        <span aria-hidden="true">×</span>
                        <span class="sr-only">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-dark">
                        ${content}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn accept-btn btn-success">Chấp nhận</button>
                    <button type="button" class="btn cancel-btn btn-danger" data-dismiss="modal">Hủy</button>

                </div>
            </div>
        </div>
    </div>
    `;

    $('body').append(modalDom);
}

function initLoadingModal(id) {
    var modalDom =
        `
    <div id=${id} class="modal fade ">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content loading-modal">
                <div class="modal-body p-5">
                    <div class="canvas">
                        <div class="spinner"></div>
                    </div>
                </div>
                <h2 class="text-center mb-4">Hệ thống đang xử lý</h2>
            </div>
        </div>
    </div>
    `;
    $('body').append(modalDom);
}

function initSuccessModal(id, linkTo) {
    var btnDom = null;
    if (typeof linkTo !== 'undefined') {
        btnDom = `<a class="btn btn-shadow btn-primary mb-3" href="/${linkTo}" role="button">Tôi hiểu rồi</a>`
    } else {
        btnDom = `<button type="button" class="btn btn-shadow btn-primary mb-3" data-dismiss="modal">Tôi hiểu rồi</button>`;
    }
    var modalDom =
        `
        <div id=${id} class="modal fade">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center">

                        <div class="section-title mt-5 mb-2">
                            <h2 class="text-gradient-02">Thông báo</h2>
                        </div>
                        <p class="mb-5 text-dark">Yêu cầu của bạn đã được thực hiện thành công</p>
                        <div class="c-icon"><i class="ion-checkmark-round big-c-icon text-success"></i></div>
                        ${btnDom}
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(modalDom);
}

function initFailureModal(id,error) {
    error = typeof error !== 'undefined' ? error : 'System error';
    var modalDom =
        `
        <div id=${id} class="modal fade">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center">

                        <div class="section-title mt-5 mb-2">
                            <h2 class="text-gradient-02">Thông báo</h2>
                        </div>
                        <p class="mb-5 text-dark">
                            Yêu cầu của bạn thực hiện thất bại
                            <br>
                            ${error}
                        </p>
                        <div class="c-icon"><i class="ion-close-round big-c-icon text-danger"></i></div>
                        
                        <button type="button" class="btn btn-shadow mb-3" data-dismiss="modal">Tôi hiểu rồi</button>
                    </div>
                </div>
            </div>
    </div>
    `;

    $('body').append(modalDom);

}

function showModal({ id, backdrop = 'dynamic', keyboard = true }) {
    $('#' + id).modal({backdrop:backdrop, keyboard: keyboard});
}

function hideModal({id}) {
    $('#' + id).modal('hide');
}