/**
* Mail.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var qr = require('qr-image');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
  host: 'mail.xrobotix.co.za',
    port: 25,
    auth: {
        user: 'invites@projectepic.info',
        pass: 'projectepic'
    },
    tls: {
        rejectUnauthorized: false
    }
}));

module.exports = {

  attributes: {
    person: {model: "Person"}
  },
  afterCreate: function(createdRecord,cb)
  {
    if (createdRecord.qrData)
    {
      
      var qr_png = qr.image(JSON.stringify(createdRecord.qrData));
      
      createdRecord.email.attachments.push({   
          filename: 'invite.png',
          content: qr_png
      });
    }

    transporter.sendMail(createdRecord.email,function(err,result){console.log(err,result)
      cb();
    });
  }
};

