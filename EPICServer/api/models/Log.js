/**
* Log.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	meeting: {model: "Meeting", via: "logs"},
	rsvp: {model: "Rsvp", via: "logs"},
	state: {type: "json", required: true}
  }
};

