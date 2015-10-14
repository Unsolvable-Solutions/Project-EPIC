// Ionic epic App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'epic' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'epic.services' is found in services.js
// 'epic.controllers' is found in controllers.js
delete window.localStorage.deviceObj;
var URL = "http://projectepic.info";
angular.module('epic', ['ionic', 'ngCordova', 'epic.controllers', 'epic.services'])

.run(function($ionicPlatform, $http, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    window.plugins.imeiplugin.getImei(function (imei) {
      if(window.localStorage.deviceObj)
      {
        $rootScope.deviceObj = JSON.parse(window.localStorage.deviceObj);
        console.log("Local Storage: " + window.localStorage.deviceObj);
      }
      else
      {
        var deviceInformation = ionic.Platform.device();

        $http.post(URL + "/device/create",{imei: imei, deviceObj: deviceInformation})
        .then(function(res)
        {
          window.localStorage.deviceObj = JSON.stringify(res.data);
          $rootScope.deviceObj = JSON.parse(window.localStorage.deviceObj);
          console.log("rootScopeObject: " + window.localStorage.deviceObj);
        },
        function(res)
        {
          //error
          console.dir("ERROR: Device id not found.");
        });
      }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.meetings', {
      url: '/meetings',
      views: {
        'tab-meetings': {
          templateUrl: 'templates/tab-meetings.html',
          controller: 'MeetingsCtrl'
        }
      }
    })
    .state('tab.meeting-detail', {
      url: '/meetings/:meetingId',
      views: {
        'tab-meetings': {
          templateUrl: 'templates/meeting-detail.html',
          controller: 'MeetingDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
