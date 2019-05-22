function initPostDetailPage() {



    loadQuillHtml();
    autoSizeEvent();
    seemoreContentOfComment();
    addComment();

    loadMoreComment();






}


function loadMoreComment() {
    $('.btn-area').on('click','.load-more-comment-btn', function () {
        let lengthOfComments = $(".comment-wrapper > div").length;
        let PostId = $('#post-id').val();
        let offset = lengthOfComments;

        $.ajax({
            type: "POST",
            url: `${API_URL}/posts/comment/loadmore`,
            data: { PostId, offset },
            success: function (result) {
                let loadMoreComments = result;
                if(loadMoreComments.length > 0){
                    for (let comment of loadMoreComments) {
                        let UserName = comment.User.username;
                        let content = comment.commentContent;
                        let commentDate = comment.commentDate;
    
                        let tmpDate = new Date(commentDate)
                        commentDate = tmpDate.getDate() + '/' + parseInt(tmpDate.getMonth() + 1) + '/' + tmpDate.getFullYear();
    
    
                        let commentDom = $("<div>", { class: "comment mb-4 ml-1" });
                        let userInfoDom = $("<p>", { class: "m-0" })
                            .append(`<span class="text-secondary font-weight-bold">${UserName}</span>`)
                            .append(`<span class="text-gray font-italic ml-2">${commentDate}</span>`);
                        let commentContentDom = $("<p>", { class: "m-0 content comment-content text-dark", html: content.substring(0,240) });
                        let fullTextDom =  $("<p>",{class:"full-comment",style:"display:none;",html:content});
                        
                        if(content.length >= 240){
                            commentContentDom.append(`<a class="m-0 p-0 ml-1 font-italic text-info seemore-btn" href='/#'>...xem thêm</a>`)
                        }
                        
                        commentDom.append(userInfoDom);
                        commentDom.append(commentContentDom);
                        commentDom.append(fullTextDom);
    
                        $('.comment-wrapper').append(commentDom);
                    }
                }else{
                    $('.load-more-comment-btn').attr('disabled',true).html('Không còn bình luận');
                }
               
            
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("some error");
            }
        });
    })

}

function seemoreContentOfComment() {
    $('.comment-wrapper').on('click', 'a.seemore-btn', function (event) {
        event.preventDefault();
        let commentWrapper = $(this).parent().parent();
        let fullText = commentWrapper.find('.full-comment').html();
        commentWrapper.find('.content').html(fullText);
        $(this).remove();
    })
}

function addComment() {
    $('.comment-btn').on('click', function (event) {
        event.preventDefault();
        let commentContent = $('#comment-box').val();
        let PostId = $('#post-id').val();
        if (commentContent.length > 0 && commentContent.length >= 20) {
            $.ajax({
                type: "POST",
                url: `${API_URL}/posts/comment`,
                data: { PostId, commentContent },
                success: function (result) {
                    let lengthOfComments = $(".comment-wrapper > div").length;
                    if(lengthOfComments <= 0){
                        $('.comment-status').remove();
                        $('.btn-area').append(`<button type="button" class="btn btn-block  btn-gradient-01 load-more-comment-btn custom-btn">Tải thêm bình
                        luận</button>`);
                    }
                   
                    $('#comment-box').val('');
                    let UserName = result.UserName;
                    let content = result.commentContent;
                    let commentDate = result.commentDate;

                    let tmpDate = new Date(commentDate)
                    commentDate = tmpDate.getDate() + '/' + parseInt(tmpDate.getMonth() + 1) + '/' + tmpDate.getFullYear();


                    let commentDom = $("<div>", { class: "comment mb-4 ml-1" });
                    let userInfoDom = $("<p>", { class: "m-0" })
                        .append(`<span class="text-secondary font-weight-bold">${UserName}</span>`)
                        .append(`<span class="text-gray font-italic ml-2">${commentDate}</span>`);
                    let commentContentDom = $("<p>", { class: "m-0 content comment-content text-dark", html: content });




                    commentDom.append(userInfoDom);
                    commentDom.append(commentContentDom);


                    $('.comment-wrapper').prepend(commentDom);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("some error");
                }
            });
        } else {
            alert("ít nhất 20 ky tu");
        }


    })
}

function quillGetHTML(inputDelta) {
    var tempQuill = new Quill(document.createElement("div"));
    tempQuill.setContents(inputDelta);
    return tempQuill.root.innerHTML;
}

function loadQuillHtml() {
    let delta = $('#post-detail').html();
    if (typeof delta !== 'undefined') {
        let inputDelta = JSON.parse(delta);
        let contentHtml = quillGetHTML(inputDelta);

        $('#post-detail').html(contentHtml).css('display', 'block');
    }
}

function autoSizeEvent() {
    $('#comment-box').on('change keydown keyup paste cut', autosize);
}

function autosize() {
    var el = this;
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
}