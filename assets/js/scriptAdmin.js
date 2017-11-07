// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/viewUsers', {
      templateUrl : '/views/viewUsers.html',
      controller  : 'controllerAdmin'
    })
    .when('/lessonsAdmin', {
      templateUrl : '/views/lessonsAdmin.html',
      controller  : 'controllerAdmin'
    })
    .when('/viewClasses', {
      templateUrl : '/views/viewClasses.html',
      controller  : 'controllerAdmin'
    })
    .when('/recommendationTeacher', {
      templateUrl : '/views/recommendationTeacher.html',
      controller  : 'controllerTeacher'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerAdmin', function($scope, $http) {

     $http.get('/api/getStudents').success(function(res){
      $scope.list1 = res;
    })
    
    $http.get('/api/getTeachers').success(function(res){
      $scope.list2 = res;
    })
    
    $http.get('/api/getParents').success(function(res){
      $scope.list3 = res;
      console.log(res);
    })
    $http.get('/api/getClasses').success(function(res){
      $scope.list4 = res;
      console.log(res.students[0]);
    })

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

  });
