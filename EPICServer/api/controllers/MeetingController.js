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
	findOne: function(req,res)
	{
		var values = req.allParams();
		var user = req.session.user;

		Meeting.findOne({id: values.id})
		.populateAll()
		.exec(function(err,meeting){
			for (var i = 0; i < meeting.owners.length; i++) {
				if (meeting.owners[i].id == user.id)
					return res.json(meeting);
			};
			return res.forbidden("You are not an owner of this meeting.");
		});
	},
	create: function(req,res)
	{
		var values = req.allParams();
		
	}
};

