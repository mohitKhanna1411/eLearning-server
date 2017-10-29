// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/manageGradeTeacher', {
      templateUrl : '/views/manageGradeTeacher.html',
      controller  : 'controllerTeacher'
    })
    .when('/lessonsTeacher', {
      templateUrl : '/views/lessonsTeacher.html',
      controller  : 'controllerLessons'
    })
    .when('/assesmentTeacher', {
      templateUrl : '/views/assesmentTeacher.html',
      controller  : 'controllerAssesment'
    })
    .when('/recommendationTeacher', {
      templateUrl : '/views/recommendationTeacher.html',
      controller  : 'controllerRecommendation'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerTeacher', function($scope, $http) {


    $scope.manageGrade= function()
	{
		var standard=$scope.standard;
		var section=$scope.section;
		var subject=$scope.subject;
		var data={"class":standard, "section":section, "subject":subject};
                console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/teacher/manageGrade', data, config)
            .success(function (data, status, headers, config) {
                $scope.ServerResponse = data;
		
		 $window.location.href = $scope.ServerResponse.redirect;
		
		
            })
            .error(function (data, status, header, config) {
                $scope.ServerResponse = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
			
			document.getElementById("message").innerHTML="Username or Password or role is incorrect";
			
            });

		
	}





      $scope.manageStudent= function()
	{
		var standard=$scope.standard;
		var section=$scope.section;
		var student=$scope.student;
		var data={"class":standard, "section":section, "student":student};
                console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/teacher/manageStudent', data, config)
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


       $scope.assesmentTeacher= function()
	{
		var type=$scope.type;
		//var data={"class":standard, "section":section, "subject":subject};
                //console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/teacher/assess', type, config)
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



     $scope.lessons= function()
	{
		var standard=$scope.standard;
		var section=$scope.section;
		var subject=$scope.subject;
		var data={"class":standard, "section":section, "subject":subject};
                console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/teacher/lessons', data, config)
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

            $http.post('/api/teacher/recommend', data, config)
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
