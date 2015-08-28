var generatePassword = require("password-maker");
var Gmailer = require("gmail-sender");
var Encoder = require('qr').Encoder;
var encoder = new Encoder;

// any options can be set here...
Gmailer.options({
    smtp: {
        service: "Gmail",
        user: "u11013878@tuks.co.za",
        pass: "Lujazel5226"
    }
});
  
var options = {
  uppercase: true,
  symbols  : false,
  numbers  : true
};

var User = {
  // Enforce model schema in the case of schemaless databases
  schema: false,

  attributes: {
    username  : { type: 'string', unique: true },
    name  : { type: 'string', required: true },
    surname  : { type: 'string', required: true },
    email     : { type: 'email',  unique: true },
    deviceID     : { type: 'string',  unique: true },
    password     : { type: 'string',  unique: false },
    passports : { collection: 'Passport', via: 'user' },
    meetingsOwned : {collection: 'Meeting', via: 'owner'},
    meetingsAttended : {collection: 'Meeting', via: 'attendees'},
    meetingInvites : {collection: 'Meeting', via: 'invitees'}
  },

  beforeCreate: function (values, cb) {
    console.log("BeforeCreate",values);

      values.password = generatePassword(options, 8);

    cb();    
  },

  afterCreate: function (values, cb) {
    console.log("AfterCreate",values);
    // encoder.on('end', function()
    // {
        Gmailer.send({
          subject: "Secret Meeting Invite",
          template: "./assets/email.html",
          from: "ProjectEpic",
          to: {
              email: "jaco@peoplesoft.co.za",
              name: values.name,
              surname: values.surname
          },
          data: {
              username: values.email,
              name: values.name,
              surname: values.surname,
              deviceID: values.deviceID,
              password: values.password
          }
          // ,
          // attachments: [
          //     {
          //         fileName: "qr.png",
          //         filePath: "./.tmp/my_qr_file.png",
          //         cid: "html5@demo"
          //     }
          // ]
        });
        cb(); 
    // });
    // encoder.encode(JSON.stringify(values), './.tmp/my_qr_file.png');
    
   
  }

};

module.exports = User;
