/**
* Rsvp.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var generatePassword = function()
{
  return "12345678";
}

module.exports = {

  attributes: { 
    status: { 
      type: 'string',
      enum: ['pending', 'yes', 'no', 'in', 'out', 'removed'],
      defaultsTo: 'pending'
    },
    meeting: { model: "Meeting", via: "rsvp", required: true},
    password: { type: "string", defaultsTo: generatePassword()},
    person: { model: "Person", via: "meetings", required: true},
    device: { model: "Device", via: "rsvp"},
    logs: {collection: "Log", via: "rsvp"}
  },
  afterUpdate: function(updatedRecord, cb)
  {
  	console.dir("UPDATED",updatedRecord);
  	Log.create({meeting: updatedRecord.meeting, rsvp: updatedRecord.id, state:updatedRecord})
  	.exec(function(err,data){
  		console.log(err,data);
  	});
  	cb();
  },
  beforeCreate: function(createdRecord, cb)
  {
    Rsvp.find({person: createdRecord.person,meeting: createdRecord.meeting})
    .exec(function(err,rsvp){
      for (var i = 0; i < rsvp.length; i++) {
        if (!(rsvp[i].status == 'removed'))
        {
          rsvp[i].status = 'removed';
          rsvp[i].save();
        }
      };
      cb();
    });
  },
  afterCreate: function(createdRecord, cb)
  {
    Person.findOne({id: createdRecord.person})
    .exec(function(err,person){
      
      var mail = {};
      mail.person = person;
      mail.email = {
        from: 'invites@projectepic.info',
        to: person.email,
        subject: 'You are invited to attend',
        html: '<html><body><h1>Your Invite Code</h1><h2>RSVP NO</h2><a href="http://projectepic.info/rsvp/no?id=' + createdRecord.id + '&password=' + createdRecord.password + '">I will NOT attend</a><h2>RSVP YES</h2><p>Scan QR code, enter details below or click on app link (GMAIL not supported)</p><p><b>Invite Code: </b>' + createdRecord.id + '</p><p><b>Secret: </b>' + createdRecord.password + '</p><a name="openApp" href="epicapp://?id=' + createdRecord.id + '&password=' + createdRecord.password + '">Add meeting to Epic Protection App</a></body></html>',
        attachments: []
      };
      mail.qrData = {id: createdRecord.id, password: createdRecord.password};

      Mail.create(mail,function(err,m){
        console.log("Sent EMAIL",err,m);
      })

  	  cb();  
    })
  }
};

