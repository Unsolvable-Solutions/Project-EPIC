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
    dateStart: {type: "date"},
  	timeStart: {type: "time"},
    dateEnd: {type: "date"},
  	timeEnd: {type: "time"},
  	owners: { collection: "User", via: "meetings"},
  	rsvp: { collection: "Rsvp", via: "meeting"},
  	logs: {collection: "Log", via: "meeting"}
  }
};

