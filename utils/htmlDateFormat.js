function parse(date){
    let day =  date.getDate(), month = date.getMonth() + 1, year = date.getFullYear();
    if(day < 10){
        day = '0' + day;
    }
    if(month < 10){
        month = '0' + month;
    }
    return `${year}-${month}-${day}`;
}

module.exports = {
    parse
}