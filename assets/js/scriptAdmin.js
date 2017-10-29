// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/viewUsers', {
      templateUrl : '/views/viewUsers.html',
      controller  : 'controllerAdmin'
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

  });
