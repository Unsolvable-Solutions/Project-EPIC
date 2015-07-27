var unirest = require('unirest');
var http = require('http').Server();
var io = require('socket.io')(http);



var meeting = {};
var invitees = [];

var getAllMeetings = function(cb)
{
	unirest.get('http://projectepic.info/meeting').end(function (response) {
		cb(response.body);
	});
}

var sync = function(id, cb)
{
	unirest.get('http://projectepic.info/meeting?id=' + id).end(function (response) {
		cb(response.body);
	});	
}

var auth = function(email,cb)
{
	console.log('Looking for',email,'in local cache.');
	if (invitees.indexOf(email) >= 0) 
	{
		console.log(email,'found in local cache.');
		cb(true);
	}
	else
	{
		console.log('User not found in local cache. Asking server...');
		sync(meeting.id,function(m){
			console.log('Sync complete. looking for',email);
			meeting = m;
			invitees = [];
			for (var i = 0; i < meeting.invitees.length; i++) {
				invitees.push(meeting.invitees[i].email);
			};
			console.log(invitees);
			if (invitees.indexOf(email) >= 0) 
			{
				console.log(email,'found in new local cache.');
				cb(true); 
			}
			else 
			{
				console.log(email,'not found in new local cache.');
				cb(false);
			}
		});
	}
}

// getAllMeetings(function(meetings){
// 	console.log(meetings);
// 	meeting = meetings[0];
// 	for (var i = 0; i < meeting.invitees.length; i++) {
// 		invitees.push(meeting.invitees[i].email);
// 	};
// 	console.log(invitees);
// 	auth('jaco@peoplesoft.co.za',function(res){
// 		console.log('AUTH',res);
// 	});
// 	auth('jaco@peoplesosft.co.za',function(res){
// 		console.log('AUTH',res);
// 	});
// });

io.on('connection', function(socket){
  	console.log('a user connected');
	socket.on('get',function(data)
	{
		if (data.model == 'meeting')
		{
			getAllMeetings(function(meetings)
			{
				console.log(meetings);
				socket.emit('meetings',meetings);
			});
		}
	});
	socket.on('set',function(data)
	{
		if (data.model == 'meeting')
		{
			console.log(data);
			meeting = data;
			sync(data.id, function(meeting)
			{
				socket.emit('meeting',meeting);
			});
		}
	});	
	socket.on('auth',function(data)
	{
			console.log(data);
			auth(data.email, function(result)
			{
				socket.emit('auth',result);
			});
		
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});