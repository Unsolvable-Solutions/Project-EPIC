app.controller('newPatientController', function($scope,$http,$location,fileUpload) 
{
    var t = this;
    
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
        $http.post("http://localhost:1337/patient/create", t.patient).
          then(function(response) {
            console.log(response);
          }, function(response) {
            console.log(response);
          });
    }

    t.check = function()
    {
        if (t.chbSame)
            t.patient.refering = t.patient.practitioner;
        else
            t.patient.refering = '';
    }

    t.patient = {};
    t.patient.allergy = [];
    t.patient.medHistory = [];
    t.patient.medTreatment = [];
    t.patient.prevOperations = [];
    
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
        if (t.patient.idNum.length == 13)
        {
            $http.get("http://localhost:1337/patient?idNum=" + t.patient.idNum).
              then(function(response) {
                if (response.data.length > 0)
                {
                    $location.path( "/patient/edit/" + response.data[0].id );
                }
                else
                {
                    $http.get("http://localhost:1337/debtor?idNum=" + t.patient.idNum).
                      then(function(response) {
                        if (response.data.length > 0)
                        {
                            $scope.$applyAsync(function(){
                                t.patient.title = response.data[0].title ;
                                t.patient.initials = response.data[0].initials ;
                                t.patient.name = response.data[0].name ;
                                t.patient.surname = response.data[0].surname ;
                                t.patient.email = response.data[0].email ;
                                t.patient.tel = response.data[0].tel ;
                                t.patient.cell = response.data[0].cell ;
                                t.patient.occupation = response.data[0].occupation ;
                                t.patient.employer = response.data[0].employer ;
                                t.patient.nationality = response.data[0].nationality ;
                                t.patient.debtor = {} ;
                                t.patient.debtor.debtor = response.data[0].debtorCode ;
                            });
                        }
                      }, function(response) {
                        console.log(response);
                      });
                }
              }, function(response) {
                console.log(response);
              });
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

});