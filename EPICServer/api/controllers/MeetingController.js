/**
 * MeetingController
 *
 * @description :: Server-side logic for managing meetings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req,res)
	{
		var user = req.session.user;

		User.findOne({id: user.id})
		.populate("meetings")
		.exec(function(err,u){
			var meetingIds = [];
			console.log(u);
			for (var i = 0; i < u.meetings.length; i++) {
				meetingIds.push(u.meetings[i].id);
			};

			Meeting.find({id: meetingIds})
			.populateAll()
			.exec(function(err,meetings){
				return res.json(meetings || []);
			});	
			console.log(u);
		});
	},
	getMeeting: function(id,cb)
	{
		var user = req.session.user;

		Meeting.findOne({id: id})
		.populateAll()
		.exec(function(err,meeting){
			Rsvp.find({meeting: meeting.id})
			.populateAll()
			.exec(function(err,rsvp){
				meeting.rsvp = rsvp;
				for (var i = 0; i < meeting.owners.length; i++) {
					if (meeting.owners[i].id == user.id)
						return cb(meeting);
				};
				return cb({});
			})
		});
	},
	findOne: function(req,res)
	{
		var values = req.allParams();
		var user = req.session.user;

		Meeting.findOne({id: values.id})
		.populateAll()
		.exec(function(err,meeting){
			Rsvp.find({meeting: meeting.id})
			.populateAll()
			.exec(function(err,rsvp){
				meeting.rsvp = rsvp;
				for (var i = 0; i < meeting.owners.length; i++) {
					if (meeting.owners[i].id == user.id)
						return res.json(meeting);
				};
				return res.forbidden("You are not an owner of this meeting.");
			})
		});
	},
	/*
	  attributes: {
	  	title: { type: "string", required: true},
	  	description: { type: "string"},
	  	room: {model: "Room", via: "meetings"},
	  	timeStart: {type: "DateTime"},
	  	timeEnd: {type: "DateTime"},
	  	owners: { collection: "User", via: "meetings"},
	  	rsvp: { collection: "Rsvp", via: "meeting"},
	  	logs: {collection: "Log", via: "meeting"}
	  }
	*/
	create: function(req,res)
	{
		var values = req.allParams();
		var user = req.session.user;
		
		Room.findOne({id: values.room})
		.populateAll()
		.exec(function(err,room){
			if (err) return res.badRequest(err);
			if (room)
			{
				var flag = false;
				for (var i = 0; i < room.owners.length; i++) {
					if (room.owners[i].id == user.id)
					{
						Meeting.create(values)
						.populateAll()
						.exec(function(err,meeting){
							if (err) return res.badRequest(err);
							meeting.owners.add(user.id);
							meeting.save();
							return res.json(meeting);
						});
						flag = true;
					}
				};
				if (!flag)
					return res.forbidden("You are not the owner of the room");
			}
			else
			{
				return res.forbidden("You are not the owner of the room");
			}
		});

	},
	addInvite: function(req,res)
	{

		var values = req.allParams();
		if (values.email && values.meeting)
		{
			
			Meeting.findOne({id: values.meeting})
			.populateAll()
			.exec(function(err,meeting){
				if (err) return res.badRequest(err);
				if (!meeting) return res.badRequest("Meeting Not Found");

				Person.findOrCreate({email: values.email},{email: values.email})
				.exec(function(err,person){
					if (err) return res.badRequest(err);
					if (!person) return res.badRequest("Person Not Found");

					Rsvp.create({person: person.id, meeting: meeting.id})
					.populateAll()
					.exec(function(err,rsvp){
						if (err) return res.badRequest(err);
						console.log("RSVP Created",rsvp);
						return res.json({success: true, rsvp: rsvp});
					})
					
				})
				
			});

		}
		else
			res.json({success: false});
	},
	rmInvite: function(req,res)
	{
		var values = req.allParams();
		if (values.email && values.meeting)
		{
			res.json({success: true});
		}
		else
			res.json({success: false});
	},
	addOwner: function(req,res)
	{
		var values = req.allParams();
		if (values.email && values.meeting)
		{
			Meeting.findOne({id: values.meeting})
			.populateAll()
			.exec(function(err,meeting){
				if (err) return res.badRequest(err);
				if (!meeting) return res.badRequest("Meeting Not Found");

				User.findOne({email: values.email})
				.exec(function(err,user){
					if (err || !user) return res.badRequest(err || "User Not Found");
					meeting.owners.add(user.id);
					meeting.save(function(err,m){
						return res.json(m);
					});
				})
				
			});
		}
		else
			res.json({success: false});
	},
	rmOwner: function(req,res)
	{
		var values = req.allParams();
		if (values.email && values.meeting)
		{
			res.json({success: true});
		}
		else
			res.json({success: false});
	}
};

