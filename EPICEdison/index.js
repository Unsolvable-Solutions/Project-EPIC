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

var auth = function(data, cb)
{
	data = data.substring(1, data.length - 1);
	console.log('Looking for',data,'in local cache.');
	if (invitees.indexOf(data) >= 0) 
	{
		console.log(data,'found in local cache.');
		cb('t');
	}
	else
	{
		console.log('User not found in local cache. Asking server...');
		sync(meeting.id,function(m){
			console.log('Sync complete. looking for',data);
			meeting = m;
			invitees = [];
			if (meeting.invitees)
			{
				for (var i = 0; i < meeting.invitees.length; i++) {
					invitees.push(meeting.invitees[i].data);
				};
				console.log(invitees);
				if (invitees.indexOf(data) >= 0) 
				{
					console.log(data,'found in new local cache.');
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

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
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
			serialPort.write(new Buffer(result), function(err, results) {
				console.log('err ' + err);
			    console.log('results ' + results);
		  	});
		});
  });
});

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