var Meeting = {
	// Enforce model schema in the case of schemaless databases
	schema: true,

  attributes: {
    rsvp  : { collection: 'User', via: 'meetingsRSVPed' },
    invites : { collection: 'User', via: 'meetingInvites' },
    attends : { collection: 'User', via: 'meetingsAttended' },
    title : {type: 'string', required : true},
    description : {type: 'string', required : true},
    location : {type: 'string', required : true},
    dateTime : {type: 'datetime'}
  }
};

module.exports = Meeting;