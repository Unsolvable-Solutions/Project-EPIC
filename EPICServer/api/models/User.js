/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	person: {model: "Person", unique: true},
  	password: {type: "string", required: true},
    meetings: {collection: "Meeting", via: "owners"},
  	rooms: {collection: "Room", via: "owners"},
  	toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate: function(values, cb)
  {
  	//HASH PASSWORD
    Person.findOne({id: values.person})
    .exec(function(err,person){
      if (person)
        values.email = person.email;
    	// console.dir(values);
    	cb();
    })
  }	
};

