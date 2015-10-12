angular.module('epic.controllers', [])
.controller('LoginCtrl', function($scope, $rootScope, $location, AuthFactory)
{
	var t = this;

	t.login = function(user)
	{
		AuthFactory.login(user,function(success,user){
			console.log(success);
			if (success)
			{
				$rootScope.login = true;
				$location.path("/page");
			}
		});
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

	t.meetings = MeetingFactory.meetings || [];

	t.createMeeting = function(meeting)
	{
		MeetingFactory.create(meeting,function(m){
			t.meetings.push(m);
		});
	}
	t.addOwner = function(meeting,owner)
	{
		MeetingFactory.addOwner(meeting,owner,function(o){
			t.meeting.push(o);
		});
	}

})
