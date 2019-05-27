$(document).ready(function () {
    $('.verify').on('click',function(e){
        alert("cc");
        e.preventDefault();
        let id = $(this).attr('id');
        initConfirmModal(id,'Verify','Publish this post ? ');
        $('#' + id).modal('show');
        // showModal({id});
    })
});
