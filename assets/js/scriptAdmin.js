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

     $scope.addinglessons= function()
	{
        $scope.msg = "";
        $scope.msg1 = "";
		var standard=$scope.standard;
		var section=$scope.section;
               var subject=$scope.subject;
		var content=$scope.content;
		var ref_link=$scope.ref_link;
		var data={"class":standard, "subject":subject, "section":section,"content":content,"ref_link":ref_link};
                console.log(data);
		$http.post('/api/admin/addlessons', data).success(function(res){
      $scope.msg1 = res;
      $scope.standard2 = "";
      $scope.section2 ="";
	$scope.subject2 ="";
      $scope.content = "";
      $scope.ref_link = "";
    })

		
	}

  });
