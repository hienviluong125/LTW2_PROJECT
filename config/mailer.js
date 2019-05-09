const api_key = 'd6ae5f9038f586640f1008c3e7aae3b5-e566273b-dd418224';
const domain = 'sandboxfea0da44eed54a69801f73739376d759.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

const port = process.env.PORT || 4200;
const homepage = `http://localhost:${port}`


function sendMail(user, token){
    let data = {
        from: `I want to die <shadecormac@gmail.com>`,
        to: 'shadecormac@gmail.com',
        subject: 'recovery password',
        html: `<html>Click this <a href="${homepage}/users/reset/${user.id}/${token}">link</a>to recover your account.</html>`,
        text: "ay"
      };  
      console.log("Link: ", data.html);
      // mailgun.messages().send(data, function (error, body) {
      //   if(error){
      //       console.log(error);
      //   }
      //   console.log("uh", data, body);
      // });
}

module.exports = {
    sendMail
}