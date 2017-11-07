// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/lessonsStudent', {
      templateUrl : '/views/lessonsStudent.html',
      controller  : 'controllerStudent'
    })
    .when('/assesmentStudent', {
      templateUrl : '/views/assesmentStudent.html',
      controller  : 'controllerStudent'
    })
    .when('/recommendationStudent', {
      templateUrl : '/views/recommendationStudent.html',
      controller  : 'controllerStudent'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerStudent', function($scope, $http) {


      $scope.lessons= function()
	{
        $scope.msg = "";
        $scope.msg1 = "";
		var standard=$scope.standard;
		var section=$scope.section;
    var subject=$scope.subject;
		
		var data={"class":standard, "subject":subject, "section":section};
                console.log(data);
		 $http.get('/api/getlessons', { params: data }).success(function(res){
	      $scope.list = res;
         console.log($scope.list);
    })

		
	}
		
	


$scope.getAssignment= function()
  {
        $scope.msg = "";
        $scope.msg1 = "";
    var standard=$scope.standard;
    var section=$scope.section;
    var subject=$scope.subject;
    
    var data={"class":standard, "subject":subject, "section":section};
                console.log(data);
     $http.get('/api/getAssign', { params: data }).success(function(res){
        $scope.res = res;
         console.log($scope.res);
    })

    
  }


    $scope.recommend= function()
	{
		var student=$scope.student;
		var topic=$scope.topic;
		var subject=$scope.subject;
		var data={"student":student, "topic":topic, "subject":subject};
                console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/student/recommend', data, config)
            .success(function (data, status, headers, config) {
                $scope.ServerResponse = data;
		
		 $window.location.href = $scope.ServerResponse.redirect;
		
		
            })
            .error(function (data, status, header, config) {
                $scope.ServerResponse = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
			
			document.getElementById("message").innerHTML="Error";
			
            });

		
	}
    
    
  });
