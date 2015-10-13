/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	me: function(req,res)
	{
		var obj = req.session.user;
		User.findOne({id: req.session.user.id})
		.populate("meetings")
		.populate("rooms")
		.exec(function(err,user){
			if (err) return res.badRequest(err);
			res.json(user.toJSON());
		});
	}
};

