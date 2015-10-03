/**
* Rsvp.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	status: { 
	    type: 'string',
	    enum: ['pending', 'yes', 'no', 'in', 'out'],
	    defaultsTo: 'pending'
  	},
	meeting: { model: "Meeting", via: "rsvp"},
	person: { model: "Person", via: "meetings"},
	deviceId: { type: "string", requires: true},
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
  afterCreate: function(createdRecord, cb)
  {
  	console.dir("CREATED", createdRecord);
  	cb();
  }
};

