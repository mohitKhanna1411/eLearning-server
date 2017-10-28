// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/reportParent', {
      templateUrl : '/views/reportParent.html',
      controller  : 'controllerTeacher'
    })
    .when('/recommendationParent', {
      templateUrl : '/views/recommendationParent.html',
      controller  : 'controllerRecommendation'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerParent', function($scope, $http) {
    
  });
