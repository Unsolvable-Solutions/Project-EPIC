/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: function(req,res)
	{
		var values = req.allParams();
		var user = req.session.user;

		Room.create(values)
		.populateAll()
		.exec(function(err,room){
			if (err) return res.badRequest(err);
			room.owners.add(user.id);
			room.save();
			res.json(room.toJSON());
		})
	}
};

