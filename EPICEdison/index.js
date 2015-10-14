var unirest = require('unirest');
//var http = require('http').createServer(handler)
//var io = require('socket.io')(http);
//var fs = require('fs');
var config = require("config");
var CryptoJS = require("http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/aes.js");

var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
	baudrate: 115200
});
var inList = [];
var inputData = "";

var login = function(id)
{
	if (id == '351680068967102')
		return 't';
	else
		return 'f';
	var encrypted = CryptoJS.AES.encrypt(id, config.apiKey);

	unirest.get('http://projectepic.info/api/in?apiKey=' + config.apiKey 
										+ '&apiSecret=' + config.apiSecret 
										+ '&roomId=' + config.roomId 
										+ '&deviceId=' + encrypted
	).end(function (response)
	{
		var resp = response.body;
		if (resp.success)
			return 't';
		else
			return 'f';
	});
}

var logout = function(id)
{
	if (id == '351680068967102')
		return 't';
	else
		return 'f';
	var encrypted = CryptoJS.AES.encrypt(id, config.apiKey);

	unirest.get('http://projectepic.info/api/out?apiKey=' + config.apiKey 
										+ '&apiSecret=' + config.apiSecret 
										+ '&roomId=' + config.roomId 
										+ '&deviceId=' + encrypted
	).end(function (response)
	{
		var resp = response.body;
		if (resp.success)
			return 't';
		else
			return 'f';
	});*/
}

var auth = function(data, cb)
{
	data = data.substring(1, data.length - 1);

	if (inList.indexOf(data) >= 0) 
	{
		var back = logout(data);
		if (back == 't')
		{
			console.log(inList);
			inList.splice(inList.indexOf(data), 1);
			console.log(inList);
		};
		cb(back);
	}
	else
	{
		var back = login(data);
		if (back == 't')
		{
			inList.push(data);
		};
		cb(back);
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
				if (err)
				{
					console.log('err ' + err);
					console.log('results ' + results);
				};
			});
		});
	});
});