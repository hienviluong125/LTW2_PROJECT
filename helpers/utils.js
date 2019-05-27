const Entities = require('html-entities').Html5Entities;

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

function getPostStatusColor(status) {
    if (status === 'pending') {
        return { color: "info", value: "Chờ phê duyệt" }
    } else if (status === 'rejected') {
        return { color: "danger", value: "Bị từ chối" }
    } else if (status === "verified") {
        return { color: "warning", value: "Chờ xuất bản" }
    } else {
        return { color: "success", value: "Đã xuất bản" }
    }
}

function createPagesArr(currentPage, count, limit) {

    let lastPage = parseInt(count / limit) + 1;
    currentPage = parseInt(currentPage);

    if (lastPage <= 3) {
        let noneTypePage = [];
        for (let i = 1; i <= lastPage; i++) {
            noneTypePage.push(i);
        }
        return { align: "none", pages: noneTypePage, lastPage }
    }
    let align = "left";
    let leftPageNum = [];
    let rightPageNum = [];
    let middlePageNum = [];

    let pages = [];
    if (currentPage <= 2) {
        for (let i = 1; i <= currentPage + (3 - currentPage); i++) {
            leftPageNum.push(i);
        }
        align = "left";
    }
    else if (currentPage > lastPage - 2) {
        for (let i = lastPage - 2; i <= lastPage; i++) {
            rightPageNum.push(i);
        }
        align = "right";
    } else {
        middlePageNum.push(currentPage - 1);
        middlePageNum.push(currentPage);
        middlePageNum.push(currentPage + 1);
        align = "middle";
    }

    pages = [...leftPageNum, ...middlePageNum, ...rightPageNum];
    return { pages, align, lastPage }
}

function parse(date) {
    let day = date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return `${year}-${month}-${day}`;
}

function decodeHtmlEntitiesFromDelta(delta, isExport = false){
    const entities = new Entities();
    delta["ops"].forEach(obj => {
        if(typeof obj["insert"] !== 'undefined'){
            if(typeof obj["insert"]["image"] == 'undefined'){
                obj["insert"] = entities.decode(obj["insert"]);	
            }else if(isExport){
                obj["attributes"] = {
                    width: 600,
                    height: 400,
                    align: 'center'
                }
            }	
        }
    })
    return delta;
}

function highlightSearchText(content,searchText){
    return content.replace(searchText,`<span class="text-danger">${searchText}</span>`)
}

function hightLightDeltaContent(deltaContent,searchText){

}

module.exports = {
    parse,
    str_to_slug,
    createPagesArr,
    getPostStatusColor,
    decodeHtmlEntitiesFromDelta,
    highlightSearchText,
    hightLightDeltaContent
}