/**
* Owner.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
  	name: "string",
  	surname: "string",
  	email: {type: "string", unique: true, required: true},
  	password: {type: "string", required: true}
  },
  beforeCreate: function (values, cb) {
    // Encrypt password
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return cb(err);
      values.password = hash;
      cb();
    });
  }

};

