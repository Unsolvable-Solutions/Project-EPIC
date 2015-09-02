// Load native UI library
var ngui = require('nw.gui');
// Get the current window
var nwin = ngui.Window.get();
onload = function() {
    nwin.show();
    nwin.maximize();
}

var url = "http://localhost:1337";

var app = angular.module('paperlessPractice', ['ngRoute'])
.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: './pages/index.html',
        controller: 'indexController'
      }).
      when('/splash', {
        templateUrl: './pages/splash.html',
        controller: 'splashController'
      }).
      when('/patients/:searchText', {
        templateUrl: './pages/patients.html',
        controller: 'patientsController'
      }).
      when('/patients/', {
        templateUrl: './pages/patients.html',
        controller: 'patientsController'
      }).
      when('/patient/edit/:patientId', {
        templateUrl: './pages/editPatient.html',
        controller: 'editPatientController'
      }).
      when('/patient/new', {
        templateUrl: './pages/newPatient.html',
        controller: 'newPatientController'
      }).
      when('/patient/:patientId', {
        templateUrl: './pages/patient.html',
        controller: 'patientController'
      }).
      when('/patient', {
        templateUrl: './pages/patients.html',
        controller: 'patientsController'
      }).
      when('/debtors', {
        templateUrl: './pages/debtors.html',
        controller: 'debtorsController'
      }).
      when('/debtor/new', {
        templateUrl: './pages/newDebtor.html',
        controller: 'newDebtorController'
      }).
      when('/debtor/edit/:debtorId', {
        templateUrl: './pages/editDebtor.html',
        controller: 'editDebtorController'
      }).
      when('/debtors', {
        templateUrl: './pages/debtors.html',
        controller: 'debtorsController'
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

app.controller('splashController', function($scope,$http) 
{
    var t = this;
    
});

app.controller('indexController', function($scope,$http) 
{
    var t = this;
    t.test = [1,2,3,4];
});

app.controller('patientsController', function($scope,$http,$routeParams) 
{
    var t = this;
    t.patient = {};
    t.searchText = $routeParams.searchText;

    t.refresh = function(limit)
    {
        $http.get( url + "/patient?limit=" + (limit || 5000)).
          then(function(response) {
            t.patients = response.data;
          }, function(response) {
            
          });
    }
    t.refresh();
});

app.controller('debtorsController', function($scope,$http) 
{
    var t = this;
    t.debtor = {};

    t.refresh = function(limit)
    {
        $http.get( url + "/debtor?limit=" + (limit || 5000)).
          then(function(response) {
            t.debtors = response.data;
          }, function(response) {
            
          });
    }
    t.refresh();
});