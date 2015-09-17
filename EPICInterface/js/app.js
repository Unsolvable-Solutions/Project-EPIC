// Load native UI library
var ngui = require('nw.gui');
// Get the current window
var nwin = ngui.Window.get();
onload = function() {
    nwin.show();
    nwin.maximize();
}

var url = "http://projectepic.info";
var appName = {name: "projectEpic", header: "Project Epic"};

var app = angular.module(appName.name, ['ngRoute'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: './templates/index.html',
        controller: 'indexController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file,cb){
        var fd = new FormData();
        fd.append('avatar', file);
        $http.post( url + "/upload/upload", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response){
            cb(response);
        })
        .error(function(){ 
            cb(response);
        });
    }
}])

app.controller('navController', function($scope,$http,$location) 
{
    var t = this;
    t.header = appName.header;

    t.searchPatient = function()
    {
        $http.get(url + "/patient/?patientId=" + t.searchText)
        .then(function(response){
            if (response.data.length == 1)
                $location.path( "/patient/edit/" + response.data[0].id );
            else
                $location.path( "/patients/" + t.searchText );
        },console.log);
    }

});

app.controller('indexController', function($scope,$http) 
{
    var t = this;
    t.test = [1,2,3,4];
});

app.controller('meetingController', function($scope,$http) 
{
    var t = this;
    t.refresh = function()
    {
        $http.get(url + "/meeting")
        .then(function(response){
            t.meetings = response.data;
        },function(response){

        });
    }
    t.refresh();
});