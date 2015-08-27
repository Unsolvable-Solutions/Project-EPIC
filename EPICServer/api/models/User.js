var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  attributes: {
    username  : { type: 'string', unique: true },
    name  : { type: 'string', required: true },
    surname  : { type: 'string', required: true },
    email     : { type: 'email',  unique: true },
    passports : { collection: 'Passport', via: 'user' },
    meetingsOwned : {collection: 'Meeting', via: 'owner'},
    meetingsAttended : {collection: 'Meeting', via: 'attendees'},
    meetingInvites : {collection: 'Meeting', via: 'invitees'}
  }
};

module.exports = User;
