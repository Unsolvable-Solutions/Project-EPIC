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
	var t = this;
	t.nextthreeMeetings = function(meetings)
	{
		///TODO get next three upcomming meetings
	}
})
.controller('MeetingsCtrl', function($scope,MeetingFactory)
{

	var t = this;

	t.newMeeting = {};
	t.newMeeting.meeting = {};
	t.newMeeting.model = MeetingFactory.model;

	MeetingFactory.getMeetings(function(meetings){
		t.meetings = meetings;
	});

	t.updateOrCreateMeeting = function(meeting)
	{
		MeetingFactory.updateOrCreate(meeting,function(m){
			t.meetings.push(m);
		});
	}
	t.addOwner = function(meeting,owner)
	{
		MeetingFactory.addOwner(meeting,owner,function(o){
			t.meeting.push(o);
		});
	}
	t.addInvite = function(meeting, invited)
	{
		//TODO:
		//the person is created and added to the db
		//person is added to meeting invite list
		//email is send to person
		//data fields is cleared and andothe person can be invited
		//the 
	}


	t.createdMeeting = {
		title:"Maret se meeting",
		room:"room M",
		description:"Maret se meeting",
		startTime:"12:12 PM",
		startDate:"16 Oktober",
		endDate:"17 Okt",
		endTime:"13:12 PM",
	//	owners:[{email:"pietie@pompies", name:"pietie"},{email:"susan@album", name:"susan"}],
	//	invited:[{email:"pietie@pompies", name:"pietie"},{email:"susan@album", name:"susan"},{email:"john@travolta",name:"johnny b goode"}]
	};

//	t.remove = function(id)
//	{
//		t.
//	}

//	t.update = function(id, )
//	{
//
//	}

})
//.controller('ReportsCtrl', function($scope,MeetingFactory)
//{
//	var t = this;

//t.meetings = MeetingFactory.meetings || [];

//})


.controller('ExportCtrl', function($scope,MeetingFactory)
{
	var t = this;

t.meetings = MeetingFactory.meetings || [];
t.meetings.csvfile = function(meeting)
{
	//TO DO
//generate csv file with meeting details + owners + invites and their status logs
}

t.meetings.pdfreport = function(meeting)
{
	//TO DO
//generate pdf report file with meeting details etc
}



})
