app.controller('editPatientController', function($scope,$http,$routeParams,fileUpload) 
{
    var t = this;
    var id = $routeParams.patientId;
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        if (file)
        {
            console.log('file is ' );
            console.dir(file);
            fileUpload.uploadFileToUrl(file, function(res){
                console.log(res);
                t.patient.img = res.files[0].fd.split("public")[1].replace('\\','/').replace('\\','/');
            });
        }
    };

    t.save = function()
    {
        $http.post(url + "/patient/update/" + t.patient.id, t.patient).
          then(function(response) {
            console.log(response);
          }, function(response) {
            console.log(response);
          });
    }

    t.patient = {};
    t.patient.allergy = [];
    t.patient.medHistory = [];
    t.patient.medTreatment = [];
    t.patient.prevOperations = [];

    t.refresh = function()
    {
        $http.get(url + "/patient/" + id).
          then(function(response) {
            $scope.$applyAsync(function(){
                t.patient = response.data;
            });
            console.log(response);
          }, function(response) {
            console.log(response);
          });                    
    }

    t.check = function()
    {
        if (t.chbSame)
            t.newPatient.refering = t.newPatient.practitioner;
        else
            t.newPatient.refering = '';
    }
    
    t.getDebtor = function()
    {
        if (t.patient.debtor.debtor.length > 5)
        {    
            $http.get(url + "/debtor?debtorCode=" + t.patient.debtor.debtor).
              then(function(response) {
                if (response.data.length > 0)
                    t.patient.debtorObject = response.data[0];

                console.log(response);
              }, function(response) {
                console.log(response);
              });                    
        }
    }

    t.getDataFromId = function()
    {
        if (t.patient.idNum.length > 6)
        {
            t.patient.idNumData = {};
            t.patient.idNumData.year = t.patient.idNum[0]+t.patient.idNum[1];
            t.patient.idNumData.month = t.patient.idNum[2]+t.patient.idNum[3];
            t.patient.idNumData.day = t.patient.idNum[4]+t.patient.idNum[5];
            if (parseInt(t.patient.idNum[6]) >= 5)
                t.patient.idNumData.gender = 'Male';
            else
                t.patient.idNumData.gender = 'Female';
        }
    }

    t.addAllergy = function(a)
    {
        $scope.$applyAsync(function(){
            t.patient.allergy.push(a);
            t.newAllergy = "";
        });
    }
    t.addHistory = function(a)
    {
        $scope.$applyAsync(function(){
            t.patient.medHistory.push(a);
            t.newHistory = "";
        });
    }
    t.addTreatment = function(a)
    {
        $scope.$applyAsync(function(){
            t.patient.medTreatment.push(a);
            t.newTreatment = "";
        });
    }
    t.addOperation = function(a)
    {
        $scope.$applyAsync(function(){
            t.patient.prevOperations.push(a);
            t.newOperation = "";
        });
    }

    t.refresh();
});