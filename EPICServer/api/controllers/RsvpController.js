/**
 * RsvpController
 *
 * @description :: Server-side logic for managing rsvps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	yes: function(req,res)
	{
		var values = req.allParams();
		if (values.id && values.password && values.deviceId)
		{
			Rsvp.findOne({id: values.id, password: values.password})
			.populateAll()
			.exec(function(err,rsvp){
				if (err) return res.badRequest(err);	
				
				if (rsvp)
				{
					if (rsvp.status == 'pending')
					{
						rsvp.device = values.deviceId;
						rsvp.status = 'yes';
						rsvp.save();

						Room.findOne({id: rsvp.meeting.room})
						.exec(function(err,room)
						{
							if (err || !room) return res.badRequest(err || "Room not found");	
							rsvp.meeting.room = room.title;
							return res.json({success: true, meeting: rsvp.meeting});		
						});
					}
					else return res.forbidden("Already exist: Status=" + rsvp.status);
				}	
				else return res.forbidden("Invalid Secret");
			})
		}
		else
			return res.badRequest("Fields not set");
	},
	no: function(req,res)
	{
		var values = req.allParams();
		if (values.id && values.password)
		{
			Rsvp.findOne({id: values.id, password: values.password})
			.exec(function(err,rsvp){
				if (err) return res.badRequest(err);	
				
				if (rsvp)
				{
					if (rsvp.status == 'pending')
					{
						rsvp.status = 'no';
						rsvp.save();
						return res.json({success: true});		
					}
					else return res.forbidden("Already exist: Status=" + rsvp.status);
				}
				else return res.forbidden("Invalid Secret");
			})
		}
		else
			return res.badRequest("Fields not set");
	},
	in: function(req,res)
	{
		var values = req.allParams();
		if (values.meetingId && values.roomId && values.apiKey && values.apiSecret && values.imei)
		{
			Room.findOne({id: values.roomId, apiKey: values.apiKey, apiSecret: values.apiSecret})
			.exec(function(err,room){
				if (err) return res.badRequest(err);	
				if (!room) return res.forbidden("Invalid Auth");

				Device.findOne({imei: values.imei})
				.exec(function(err,device){
					if (err || !device) return res.badRequest(err||"No device found");
					console.log({meeting: values.meetingId, device: device.id});
					Rsvp.findOne({meeting: values.meetingId, device: device.id, status: { not: 'removed' }})
					.populateAll()
					.exec(function(err,rsvp){
						if (err || !room) return res.badRequest(err || "No room found");	
						console.log(rsvp);
						if (rsvp && rsvp.meeting.room == room.id)
						{
							if (rsvp.status == "yes" || rsvp.status == "out")
							{
								rsvp.status = 'in';
								rsvp.save();
								return res.json({success: true});		
							}
							else return res.forbidden("Status=" + rsvp.status);
						}
						else return res.forbidden("Invalid Auth");
					})
				})
			})
		}
		else
			return res.badRequest("Fields not set");
	},
	out: function(req,res)
	{
		var values = req.allParams();
		if (values.meetingId && values.roomId && values.apiKey && values.apiSecret && values.imei)
		{
			Room.findOne({id: values.roomId, apiKey: values.apiKey, apiSecret: values.apiSecret})
			.exec(function(err,room){
				if (err) return res.badRequest(err);	
				if (!room) return res.forbidden("Invalid Auth");

				Device.findOne({imei: values.imei})
				.exec(function(err,device){
					if (err || !device) return res.badRequest(err||"No device found");
					console.log({meeting: values.meetingId, device: device.id});
					Rsvp.findOne({meeting: values.meetingId, device: device.id, status: { not: 'removed' }})
					.populateAll()
					.exec(function(err,rsvp){
						if (err || !room) return res.badRequest(err || "No room found");	
						console.log(rsvp);
						if (rsvp && rsvp.meeting.room == room.id)
						{
							if (rsvp.status == "in")
							{
								rsvp.status = 'out';
								rsvp.save();
								return res.json({success: true});		
							}
							else return res.forbidden("Status=" + rsvp.status);
						}
						else return res.forbidden("Invalid Auth");
					})
				})
			})
		}
		else
			return res.badRequest("Fields not set");
	}
};

