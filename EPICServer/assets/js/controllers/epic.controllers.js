angular.module('epic.controllers', [])
.controller('LoginCtrl', function($scope, $rootScope, $location, AuthFactory)
{
	var t = this;  
	t.loginError="";//"Invalid Email or Password2222";
		
	$scope.user={};
	t.login = function(user)
	{
		if(!user.email || !user.password)
		{
			t.loginError="Invalid Email or Password";
		}
		else{

			AuthFactory.login(user,function(success,user){
				console.log(success);
				if (success)
				{
					$rootScope.login = true;
					$location.path("/page");
				}
			});
		}
	}
		t.clearLoginError = function()
		{
			t.loginError ="some";
		}
})
.controller('DashCtrl', function($scope)
{
	
})
.controller('MeetingsCtrl', function($scope,MeetingFactory)
{

	var t = this;

	t.newMeeting = {};
	t.newMeeting.meeting = {};
	t.newMeeting.model = MeetingFactory.model;

	t.loading = true;
	MeetingFactory.getMeetings(function(meetings){
		t.loading = false;
		t.meetings = meetings;
	});

	MeetingFactory.getRooms(function(rooms){
		t.loading = false;
		t.rooms = rooms;
	});

	t.updateOrCreateMeeting = function(meeting)
	{
		t.loading = true;
		MeetingFactory.updateOrCreate(meeting,function(m){
			MeetingFactory.getMeetings(function(meetings){
				t.new = m;
				t.loading = false;
				t.meetings = meetings;
			});
		});
	}

	t.changeMeeting = function(meetingId)
	{
		t.loading = true;
		MeetingFactory.getMeeting(meetingId,function(m){
			t.new = m;
			t.loading = false;
		});
	}

	t.addOwner = function(meeting,email)
	{
		MeetingFactory.addOwner(meeting,email,function(meeting){
			console.log(meeting);
			t.new = meeting;
		});
	}

	t.addInvite = function(meeting,email)
	{
		MeetingFactory.addInvite(meeting,email,function(rsvp){
			console.log(rsvp);
			rsvp.person = {email: email};
			t.new.rsvp = t.new.rsvp || [];
			t.new.rsvp.push(rsvp);
		});
	}

	t.removeMeeting = function(id)
	{

	}

})
//.controller('ReportsCtrl', function($scope,MeetingFactory)
//{
//	var t = this;

//t.meetings = MeetingFactory.meetings || [];

//})


.controller('ExportCtrl', function($scope,MeetingFactory)
{
	var t = this;

	MeetingFactory.getMeetings(function(meetings){
		t.loading = false;
		t.meetings = meetings;
	});

})
