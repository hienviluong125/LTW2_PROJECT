const subscriberModel = require('./../models/index').Subscribers;
const deltaToHtml = require('../helpers/delta-to-html');
const pdf = require('html-pdf');
const fs = require('fs');

function getRenewalDate(){
    let date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
}

function create(UserId, isFirstTime = false ){
    let date = getRenewalDate();
    return subscriberModel.create({
        UserId,
        expireDate: date,
        status: isFirstTime? 'valid' : 'pending'
    });
}


function getLatestSubscription(UserId){
    return subscriberModel.findOne({
        raw: true,
        where:{
            UserId
        },
        order: [ [ 'createdAt', 'DESC' ]]
    })
}

async function renewSubscription(UserId){
    try{
        let latestSub = await getLatestSubscription(UserId);
        latestSub.status = 'valid';
        latestSub.expireDate = getRenewalDate();
        return subscriberModel.update(latestSub, {
            where: {
                UserId: latestSub.UserId,
                id: latestSub.id
            }
        })
    }catch(err){
        throw err;
    }
}

async function isPremium(UserId){
    try{
        let latestSub = await getLatestSubscription(UserId);
        if(latestSub){
            let now = new Date();
            return (now.getTime() < latestSub.expireDate.getTime()) ? true : false;
        }else return false;
        
    }catch(err){
        throw err;
    }
}

function exportPdf(res, delta, filename){
    let html = deltaToHtml.convert(delta, filename);
    pdf.create(html, deltaToHtml.pdfConfig).toFile(`${deltaToHtml.getAssetsPath()}assets/pdf/${filename}.pdf` ,function(err, resPdf){
        if(err){
            throw err;
        }else {
            fs.readFile(resPdf.filename, function (err,data){
                res.contentType("application/pdf");
                res.send(data);
            })
        }
    });
}

module.exports = {
    create,
    getLatestSubscription,
    renewSubscription,
    isPremium,
    exportPdf
}