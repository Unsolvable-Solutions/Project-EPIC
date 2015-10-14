angular.module('epic.main', ['epic.controllers','epic.services','ngHolder', 'ui.router', 'mgo-angular-wizard', 'formly', 'formlyBootstrap'])
.run(function($rootScope,$location) {
  if ($rootScope.login)
  	$location.path("/login");
})
.config(function($stateProvider, $urlRouterProvider) {


$stateProvider


	.state('login', {
		url: '/login',
	    templateUrl: 'templates/login.html',
	    controller: 'LoginCtrl as l'
	})

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
	
	.state('page.reports', {
	url: '/reports',
	views: {
	  	'view.reports': {
	    templateUrl: 'templates/page.reports.html',
	    controller: 'ReportsCtrl as r'
	  }
	}
	})

	.state('page.export', {
	url: '/export',
	views: {
	  	'view.export': {
	    templateUrl: 'templates/page.export.html',
	    controller: 'ExportCtrl as r'
	  }
	}
	});

	$urlRouterProvider.otherwise('/page/dash');

});