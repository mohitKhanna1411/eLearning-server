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
      controller  : 'controllerLessons'
    })
    .when('/recommendationStudent', {
      templateUrl : '/views/recommendationStudent.html',
      controller  : 'controllerRecommendation'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerStudent', function($scope, $http) {
    
  });
