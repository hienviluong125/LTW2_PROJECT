
function createTags(label) {
    let spanLabel = $("<span/>").html(label);
    let removeIcon = $("<i/>", { class: 'ion-close-round' });
    $("<div/>", { class: 'tags' })
        .append(spanLabel)
        .append('&ensp;')
        .append(removeIcon)
        .insertBefore($('.tag-input'));

}


$(document).ready(function () {
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



    // let tagList = [];
    $('.tag-input').keypress(function (e) {
        let that = $(this);
        if (e.keyCode == '13') {
            e.preventDefault();
            let label = that.val();
            createTags(label);
            that.val('');
        }
    })


});
