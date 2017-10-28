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
    
  });
