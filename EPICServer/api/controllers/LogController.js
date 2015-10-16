/**
 * LogController
 *
 * @description :: Server-side logic for managing logs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var getMeeting = function(user,id,cb)
{
	Meeting.findOne({id: id})
	.populateAll()
	.exec(function(err,meeting){
		if (!meeting) return cb();
		Rsvp.find({meeting: meeting.id})
		.populateAll()
		.exec(function(err,rsvp){
			meeting.rsvp = rsvp;
			for (var i = 0; i < meeting.owners.length; i++) {
				if (meeting.owners[i].id == user.id)
					return cb(meeting);
			};
			return cb();
		})
	});
}

module.exports = {
	pdf: function(req,res)
	{
		var values = req.allParams();
		if (values.meeting)
		{
			getMeeting(req.session.user,values.meeting, function(m){
				if (!m) return res.forbidden("You are not an owner of this meeting.");

				var PDFDocument = require('pdfkit');
				var filename = m.title + ".pdf"; 
				filename = encodeURIComponent(filename);
				
				res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
				res.setHeader('Content-type', 'application/pdf');
				
				var doc = new PDFDocument()

				doc.pipe(res)

				doc.fontSize(8);
				doc.text(JSON.stringify(m,null,4), {width: 410, align: 'left'});

				//Add another page
				doc.addPage()
				   .fontSize(25)
				   .text('Brought to you by Unsolveable Solutions', 100, 100)

				//Draw a triangle
				doc.save()
				   .moveTo(100, 150)
				   .lineTo(100, 250)
				   .lineTo(200, 250)
				   .fill("#FF3300")

				//Apply some transforms and render an SVG path with the 'even-odd' fill rule
				doc.scale(0.6)
				   .translate(470, -380)
				   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
				   .fill('red', 'even-odd')
				   .restore()

				//Add some text with annotations
				doc.addPage()
				   .fillColor("blue")
				   .text('Here is a link!', 100, 100)
				   .underline(100, 100, 160, 27, {color: "#0000FF"})
				   .link(100, 100, 160, 27, 'http://projectepic.info/')

				//Finalize PDF file
				doc.end()
			});
		}
		else
			return res.badRequest("Field not set");

	},
	csv: function(req,res)
	{
		var values = req.allParams();
		
		if (values.meeting)
		{
			var json2csv = require('json2csv');
			getMeeting(req.session.user,values.meeting, function(m){
				if (!m) return res.forbidden("You are not an owner of this meeting.");
				var filename = m.title + ".csv"; 
				filename = encodeURIComponent(filename);
				res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
				res.setHeader('Content-type', 'text/csv');

				json2csv({ data: m, nested: true}, function(err, csv) {
				  	if (err) console.log(err);
				  	console.log(csv);
				  	res.send(csv);
				});

			});
		}
		else
			res.badRequest("Fields not set");
	}		
};


