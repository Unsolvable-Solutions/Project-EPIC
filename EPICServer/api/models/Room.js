/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var generateSecret = function()
{
	return "12345678";
}

module.exports = {

  attributes: {
  	title: {type: "string", required: true},
  	location: {type: "string", required: true},
  	meetings: {collection: "Meeting", via: "room"},
  	owners: {collection: "User", via: "rooms"},
  	apiKey: {type: "string", required: true},
  	apiSecret: {type: "string", defaultsTo: generateSecret()}
  }
};

