function initPostListPageEvent(){
    console.log("hi");
    $('.delete-post').on('click',function(e){
        e.preventDefault();
        let id = $(this).data('id');
        showModal({id: 'modal-centered-' + id});
    })
}