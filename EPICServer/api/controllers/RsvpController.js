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
			.exec(function(err,rsvp){
				if (err) return res.badRequest(err);	
				
				if (rsvp)
				{
					if (rsvp.status == 'pending')
					{
						rsvp.device = values.deviceId;
						rsvp.status = 'yes';
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
		if (values.id && values.password && values.roomId && values.apiKey && values.apiSecret && values.deviceId)
		{
			Room.findOne({id: values.roomId, apiKey: values.apiKey, apiSecret: values.apiSecret})
			.exec(function(err,room){
				if (err) return res.badRequest(err);	
				if (!room) return res.forbidden("Invalid Auth");

				Rsvp.findOne({id: values.id, password: values.password})
				.populateAll()
				.exec(function(err,rsvp){
					if (err) return res.badRequest(err);	
					console.log(rsvp);
					if (rsvp && rsvp.meeting.room == room.id && rsvp.device.deviceId == values.deviceId)
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
		}
		else
			return res.badRequest("Fields not set");
	},
	out: function(req,res)
	{
		var values = req.allParams();
		if (values.id && values.password && values.roomId && values.apiKey && values.apiSecret && values.deviceId)
		{
			Room.findOne({id: values.roomId, apiKey: values.apiKey, apiSecret: values.apiSecret})
			.exec(function(err,room){
				if (err) return res.badRequest(err);	
				if (!room) return res.forbidden("Invalid Auth");

				Rsvp.findOne({id: values.id, password: values.password})
				.populateAll()
				.exec(function(err,rsvp){
					if (err) return res.badRequest(err);	
					console.log(rsvp);
					if (rsvp && rsvp.meeting.room == room.id && rsvp.device.deviceId == values.deviceId)
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
		}
		else
			return res.badRequest("Fields not set");
	}
};

