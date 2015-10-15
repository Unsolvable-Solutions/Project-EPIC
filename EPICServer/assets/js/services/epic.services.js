angular.module('epic.services', [])
.factory('AuthFactory', function($http){
	var obj = {}; 

	obj.login = function(user,cb)
	{
		if (user.email && user.password)
		{
			$http.post(URL + "/login", {email: user.email, password: user.password})
			.then(function(res){
				cb(res.data.success || false);
			},function(err){
				cb(false);
			});
		}
		else
			cb(false);
	}

	return obj;
})
.factory('MeetingFactory', function($http){
	var obj = {};
	
	obj.getRooms = function(cb)
	{
		$http.get(URL + "/me")
		.then(function(res){
			console.log(res.data);
			return cb(res.data.rooms || []);
		},function(err){
			return cb([]);
		});
	}

	obj.getMeetings = function(cb)
	{
		$http.get(URL + "/meeting")
		.then(function(res){
			console.log(res.data);
			return cb(res.data);
		},function(err){
			return cb([]);
		});
	}

	obj.getMeeting = function(id,cb)
	{
		$http.get(URL + "/meeting/" + id)
		.then(function(res){
			console.log(res.data);
			return cb(res.data);
		},function(err){
			return cb([]);
		});
	}

	obj.updateOrCreate = function(meeting,cb)
	{
		if (meeting.id)
		{
			///meeting/update/1?title=test
			delete meeting.owners;
			delete meeting.rsvp;
			delete meeting.logs;
			$http.post(URL + "/meeting/update/" + meeting.id, meeting)
			.then(function(res){
				console.log(res.data);
				cb(res.data);
			},function(err){
				console.log(err);
				cb(err);
			});
		}
		else
		{
			$http.post(URL + "/meeting/create/", meeting)
			.then(function(res){
				console.log(res.data);
				cb(res.data);
			},function(err){
				console.log(err);
				cb(err);
			});	
		}
	}

	obj.addOwner = function(meeting,email,cb)
	{
		$http.post(URL + "/owner/add", {meeting: meeting.id, email: email})
		.then(function(res){
			cb(res.data);
		},function(err){
			cb(err);
		});	
	}

	obj.addInvite = function(meeting,email,cb)
	{
		$http.post(URL + "/invite/add", {meeting: meeting.id, email: email})
		.then(function(res){
			cb(res.data.rsvp);
		},function(err){
			cb(err);
		});
	}


	return obj;
})
