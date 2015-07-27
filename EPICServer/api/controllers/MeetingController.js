/**
 * MeetingController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	meetings: function (req, res) {
    
	Meeting.find({},function(m){
	    res.view({
	    	meetings : m,
	    	errors : req.flash('error')
	    });
	});

  }
};