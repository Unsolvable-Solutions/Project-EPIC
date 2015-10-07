angular.module('epic.main', ['epic.controllers','epic.services','ui.router','formly', 'formlyBootstrap'])
.run(function() {
  
})
.config(function($stateProvider, $urlRouterProvider) {


$stateProvider

	.state('page', {
		url: '/page',
		abstract: true,
		templateUrl: 'templates/pages.html'
	})

	.state('page.dash', {
		url: '/dash',
		views: {
		  	'page-dash': {
		    templateUrl: 'templates/page.dash.html',
		    controller: 'DashCtrl'
		  }
		}
	})

	.state('page.meetings', {
		url: '/meetings',
		views: {
			'page-meetings': {
			templateUrl: 'templates/page.meetings.html',
			controller: 'MeetingsCtrl'
		}
		}
	})
	.state('page.meeting-detail', {
	  url: '/meetings/:meetingId',
	  views: {
	    	'page-meetings': {
	      	templateUrl: 'templates/meeting-detail.html',
	      	controller: 'MeetingDetailCtrl'
	    }
	  }
	})

	.state('page.account', {
	url: '/account',
	views: {
	  	'page-account': {
	    templateUrl: 'templates/page-account.html',
	    controller: 'AccountCtrl'
	  }
	}
	});

	$urlRouterProvider.otherwise('/page/dash');

});