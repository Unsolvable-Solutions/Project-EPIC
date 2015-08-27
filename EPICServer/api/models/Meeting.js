var Meeting = {
	// Enforce model schema in the case of schemaless databases
	schema: true,

  attributes: {
    owner  : { model: 'user' },
    invitees : { collection: 'User', via: 'meetingInvites' },
    attendees : { collection: 'User', via: 'meetingsAttended' },
    title : {type: 'string', required : true},
    description : {type: 'string', required : true},
    location : {type: 'string', required : true},
    dateTime : {type: 'datetime'}
  }
};

module.exports = Meeting;