$(document).ready(function () {
    $('.verify').on('click',function(e){
        
    })

    $('.posts-datatable').on('click','i.admin-delete-post',function(e){
        e.preventDefault();
        var r = confirm("Delete this post ? ");
        if(r){
            var deleteHref = $(this).parent().attr('href');
            window.location.href = deleteHref;
        }
    })

    $('.posts-datatable').on('click','i.admin-verify-post',function(e){
        e.preventDefault();
        var r = confirm("Publish this post ? ");
        if(r){
            var publishHref = $(this).parent().attr('href');
            window.location.href = publishHref;
        }
    })


    
});
