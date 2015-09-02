app.controller('newDebtorController', function($scope,$http,$location) 
{
    var t = this;
    
    t.save = function()
    {
        $http.post(url + "/debtor/create", t.newDebtor).
            then(function(response) {
            console.log(response);
            }, function(response) {
            console.log(response);
            });
    }

    t.getDataFromId = function()
    {
        if (t.newDebtor.idNum.length == 13)
        {        
            $http.get(url + "/debtor?idNum=" + t.newDebtor.idNum).
                then(function(response){
                    if (response.data.length > 0)
                        $location.path( "/debtor/edit/" + response.data[0].id );
                    else
                    {
                        $http.get(url + "/patient?idNum=" + t.newDebtor.idNum).
                            then(function(response) {
                                if (response.data.length > 0)
                                {
                                    $scope.$applyAsync(function(){
                                        t.newDebtor.title = response.data[0].title ;
                                        t.newDebtor.initials = response.data[0].initials ;
                                        t.newDebtor.name = response.data[0].name ;
                                        t.newDebtor.surname = response.data[0].surname ;
                                        t.newDebtor.email = response.data[0].email ;
                                        t.newDebtor.tel = response.data[0].tel ;
                                        t.newDebtor.cell = response.data[0].cell ;
                                        t.newDebtor.occupation = response.data[0].occupation ;
                                        t.newDebtor.employer = response.data[0].employer ;
                                        t.newDebtor.nationality = response.data[0].nationality ;
                                    });
                                }
                                console.log(response);
                            }, function(response) {
                                console.log(response);
                            });    
                    }
                }, function(response){

                });
        }
    }

    t.newDebtor = {};
});