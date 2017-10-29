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
      controller  : 'controllerTeacher'
    })
    .when('/assesmentTeacher', {
      templateUrl : '/views/assesmentTeacher.html',
      controller  : 'controllerTeacher'
    })
    .when('/recommendationTeacher', {
      templateUrl : '/views/recommendationTeacher.html',
      controller  : 'controllerTeacher'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerTeacher', function($scope, $http) {

     $http.get('/api/listStudentIDs').success(function(res){
      $scope.options = res;
      console.log($scope.options[0]._id);
    })



        $scope.msg1 = ""
        $scope.msg = "";
    $scope.manageGrade= function()
	{
        $scope.msg1 = ""
        $scope.msg = "";
        console.log("inside manageGrade");
		var standard=$scope.standard;
		var section=$scope.section;
		var subject=$scope.subject;
		var data={"class":standard, "section":section, "subject":subject};
                console.log("data "+data);
 $http.post('/api/teacher/manageGrade', data).success(function(res){
      $scope.msg = res;
      $scope.standard = "";
      $scope.section ="";
      $scope.subject = "";
    })
		
	}





      $scope.addingStudent= function()
	{
        $scope.msg = "";
        $scope.msg1 = "";
		var standard=$scope.standard1;
		var section=$scope.section1;
        var subject=$scope.subject1;
		var studentID=$scope.studentID;
		var data={"class":standard, "subject":subject, "section":section, "student":studentID};
                console.log(data);
		$http.post('/api/teacher/addStudent', data).success(function(res){
      $scope.msg1 = res;
      $scope.standard1 = "";
      $scope.section1 ="";
      $scope.subject1 = "";
      $scope.studentID = "";
    })

		
	}

       $scope.deletingStudent= function()
    {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard1;
        var section=$scope.section1;
        var subject=$scope.subject1;
        var studentID=$scope.studentID;
        var data={"class":standard, "subject":subject, "section":section, "student":studentID};
                console.log(data);
        $http.post('/api/teacher/deleteStudent', data).success(function(res){
      $scope.msg1 = res;
      
      $scope.studentID = "";
    })

        
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
