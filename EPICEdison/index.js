var unirest = require('unirest');
var http = require('http').createServer(handler)
var io = require('socket.io')(http);
var fs = require('fs');
var inputData = "";

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
	baudrate: 115200
});



http.listen(3000, function(){
	console.log('listening on *:3000');
});

function handler (req, res) {
	fs.readFile(__dirname + '/index.html',
	function (err, data) {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
}

var meeting = {};
var rsvp = [];
var inList = [];
var outList = [];

var getAllMeetings = function(cb)
{
	unirest.get('http://projectepic.info/meeting').end(function (response) {
		cb(response.body);
	});
}

var sync = function(id, cb)
{
	unirest.get('http://projectepic.info/meeting/' + id).end(function (response)
	{
		meeting = response.body;
		if (meeting.rsvp)
		{
			for (var i = 0; i < meeting.rsvp.length; i++)
			{
				rsvp.push(meeting.rsvp[i].data);
			};
		}
		if (meeting.inList)
		{
			for (var i = 0; i < meeting.inList.length; i++)
			{
				inList.push(meeting.inList[i].data);
			};
		}
		if (meeting.outList)
		{
			for (var i = 0; i < meeting.outList.length; i++)
			{
				outList.push(meeting.outList[i].data);
			};
		}
		cb(meeting);
	});
}

var auth = function(data, cb)
{
	data = data.substring(1, data.length - 1);
	console.log('Looking for',data,'in local cache.');

	if (!meeting)
	{
		console.log('No meeting chosen.');
		cb('e');
	};

	var index;
	if ((index = outList.indexOf(data)) >= 0) 
	{
		console.log(data,'found in local cache.');
		unirest.get('http://projectepic.info/meeting/' + meeting.id + '/inList/add/' + outList[index].id).end(function (response1) {
			unirest.get('http://projectepic.info/meeting/' + meeting.id + '/outList/remove/' + outList[index].id).end(function (response2) {
				console.log(response2);
				sync(meeting.id, function(m)
				{
					console.log("New synced data: " + m);
				});
			});
		});
		cb('t');
	}
	else if ((index = inList.indexOf(data)) >= 0) 
	{
		console.log(data,'found in local cache.');
		unirest.get('http://projectepic.info/meeting/' + meeting.id + '/outList/add/' + inList[index].id).end(function (response1) {
			unirest.get('http://projectepic.info/meeting/' + meeting.id + '/inList/remove/' + inList[index].id).end(function (response2) {
				console.log(response2);
				sync(meeting.id, function(m)
				{
					console.log("New synced data: " + m);
				});
			});
		});
		cb('t');
	}
	else if ((index = rsvp.indexOf(data)) >= 0) 
	{
		console.log(data,'found in local cache.');
		unirest.get('http://projectepic.info/meeting/' + meeting.id + '/inList/add/' + rsvp[index].id).end(function (response1) {
			unirest.get('http://projectepic.info/meeting/' + meeting.id + '/rsvp/remove/' + rsvp[index].id).end(function (response2) {
				console.log(response2);
				sync(meeting.id, function(m)
				{
					console.log("New synced data: " + m);
				});
			});
		});
		cb('t');
	}
	else 
	{
		console.log('User not found in local cache. Asking server...');
		sync(meeting.id,function(m)
		{
			console.log('Sync complete. looking for',data);
			if (meeting.rsvp)
			{
				var index = rsvp.indexOf(data);
				if (index >= 0) 
				{
					console.log(data,'found in new local cache.');
					unirest.get('http://projectepic.info/meeting/' + meeting.id + '/inList/add/' + rsvp[index].id).end(function (response1) {
						unirest.get('http://projectepic.info/meeting/' + meeting.id + '/rsvp/remove/' + rsvp[index].id).end(function (response2) {
							console.log(response2);
							sync(meeting.id, function(m)
							{
								console.log("New synced data: " + m);
							});
						});
					});
					cb('t'); 
				}
				else 
				{
					console.log(data,'not found in new local cache.');
					cb('f');
				}
			}
			else
			{
				cb('e');
			}
		});
	}
}

serialPort.on("open", function ()
{
	console.log('open');

	serialPort.on('data', function(data)
	{
		console.log('data received: ' + data);

		if (data.slice(-1) != '#')
		{
			inputData += data;
			return;
		}

		if (data.slice(0, 1) != '*')
		{
			var temp = data;
			data = inputData + temp;
			inputData = "";
		}

		console.log('Input: ' + data.toString('utf8'));
		auth(data.toString('utf8'), function(result)
		{
			console.log('SENDING TO SERIAL', result);
			serialPort.write(new Buffer(result), function(err, results)
			{
				console.log('err ' + err);
				console.log('results ' + results);
			});
		});
	});
});

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
			sync(meeting.id, function(meeting)
			{
				socket.emit('meeting',meeting);
			});
		}
	});

	socket.on('auth',function(data)
	{
		console.log(data);
		auth(data, function(result)
		{
			socket.emit('auth',result);
			serialPort.write(new Buffer(result), function(err)
			{
				console.log('err ' + err);
				console.log('results ' + results);
			});
		});
	});
});

var Lcd = require('lcd');
var lcd = new Lcd({rs: 8, e: 9, data: [4, 5, 6, 7], cols: 8, rows: 1});
 
lcd.on('ready', function ()
{
	setInterval(function ()
	{
		lcd.setCursor(0, 0);
		lcd.print(new Date().toISOString().substring(11, 19));
	}, 1000);
});