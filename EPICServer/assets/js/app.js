angular.module('epic.main', ['epic.controllers','epic.services','ngHolder', 'ui.router', 'mgo-angular-wizard', 'formly', 'formlyBootstrap'])
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
		  	'view.dash': {
			    templateUrl: 'templates/page.dash.html',
			    controller: 'DashCtrl'
		  	}
		}
	})

	.state('page.meetings', {
		url: '/meetings',
		views: {
			'view.meetings': {
			templateUrl: 'templates/page.meetings.html',
			controller: 'MeetingsCtrl as meeting'
			}
		}
	})
	.state('page.meeting', {
	  url: '/meetings/:meetingId',
	  views: {
	    	'view.meetings': {
	      	templateUrl: 'templates/meeting-detail.html',
	      	controller: 'MeetingDetailCtrl'
	    }
	  }
	})

	.state('page.account', {
	url: '/account',
	views: {
	  	'view.account': {
	    templateUrl: 'templates/page.account.html',
	    controller: 'AccountCtrl'
	  }
	}
	});

	$urlRouterProvider.otherwise('/page/dash');

});