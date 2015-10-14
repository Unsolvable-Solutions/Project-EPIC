angular.module('epic.services', [])

.factory('Meetings', function($http, $ionicPopup, $rootScope) {

  // An alert dialog
  var showAlert = function(t, mes) {
    var alertPopup = $ionicPopup.alert({
      title: t,
      template: mes
    });
    alertPopup.then(function(res) {
      console.log('Alerted message');
    });
  };

  // Might use a resource here that returns a JSON array

  return {
    all: function() {
      return $rootScope.deviceObj.meetings || [];
    },
    add: function(i,s,d,cb){
      $rootScope.loading();
      $http.post(URL + "/rsvp/yes",
        {
          id:i,
          password:s,
          deviceId:d
        }
      ).then(function(res)
        {
          $rootScope.hide();
          console.log("RSVP successful");
          showAlert("Successful!", "You have RSVP'd for the meeting!");
          cb(res.data);
        },
        function(res)
        {
          //error
          $rootScope.hide();
          console.log("ERROR: RSVP failed.");
          console.log(JSON.stringify(res));
          showAlert("An error has occured!", res.data);
          cb(res);
        });
    },
    remove: function(chat) {
      $rootScope.deviceObj.meetings.splice($rootScope.deviceObj.meetings.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < $rootScope.deviceObj.meetings.length; i++) {
        if ($rootScope.deviceObj.meetings[i].id === parseInt(chatId)) {
          return $rootScope.deviceObj.meetings[i];
        }
      }
      return null;
    }
  };
});
