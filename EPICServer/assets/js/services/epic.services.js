angular.module('epic.services', [])
.factory('AuthFactory', function(){
	var obj = {};

	obj.login = function(user,cb)
	{
		if (user.email && user.password)
			cb(true);
		else
			cb(false);
	}

	return obj;
})
.factory('UserFactory', function(){
	var obj = {};

	obj.getRooms = function()
	{
		return [{id:1,title:"Room 1"},{id:2,title:"Room 2"},{id:3,title:"Room 3"}];
	}

	obj.getMeetings = function()
	{
		return [
			{id:1,title:"Meeting 1", description: "Cool meeting", timeStart: new Date(), timeEnd: new Date()},
			{id:2,title:"Meeting 2", description: "Cool meeting", timeStart: new Date(), timeEnd: new Date()},
			{id:3,title:"Meeting 3", description: "Cool meeting", timeStart: new Date(), timeEnd: new Date()},
			{id:4,title:"Meeting 4", description: "Cool meeting", timeStart: new Date(), timeEnd: new Date()}
		];
	}

	return obj;
})
.factory('MeetingFactory', function(UserFactory){
	var obj = {};

	obj.model = [];
	//step1
	obj.model.push([
		{
	      key: 'title',
	      type: 'input',
	      templateOptions: {
	        type: 'text',
	        label: 'Meeting Title',
	        placeholder: 'Enter Title'
	      }
	    },
	    {
	      key: 'description',
	      type: 'input',
	      templateOptions: {
	        type: 'text',
	        label: 'Meeting Description',
	        placeholder: 'Enter Description'
	      }
	    },
	    {
		  key: "room",
		  type: "select",
		  templateOptions: {
		    label: "Please select the room where the meeting will take place",
		    valueProp: "id",
		    labelProp: "title",
		    options: UserFactory.getRooms()
		  }
		},
	    {
		  key: "timeStart",
		  type: "input",
		  templateOptions: {
		  	type: "time",
		  	label: "Start Date/Time"
		  }
		},
	    {
		  key: "timeEnd",
		  type: "input",
		  templateOptions: {
		  	type: "time",
		  	label: "End Date/Time"
		  }
		}
	]);
	obj.model.push([
		{
		    type: "input",
		    key: "email",
		    templateOptions: {
		      type: "email",
		      label: "Owner Email"
		    }
		}
	]);

	obj.meetings = UserFactory.getMeetings();

	return obj;
})