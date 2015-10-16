/**
* Meeting.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    title: { type: "string", required: true},
    description: { type: "string"},
    room: {model: "Room", via: "meetings"},
    dateStart: {type: "datetime"},
    dateEnd: {type: "datetime"},
    owners: { collection: "User", via: "meetings"},
    rsvp: { collection: "Rsvp", via: "meeting"},
    logs: {collection: "Log", via: "meeting"}
  },
  beforeCreate: function(record,cb)
  {
    cb();
  }
};

