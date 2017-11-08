// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/reportParent', {
      templateUrl : '/views/reportParent.html',
      controller  : 'controllerParent'
    })
    .when('/recommendationParent', {
      templateUrl : '/views/recommendationParent.html',
      controller  : 'controllerParent'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerParent', function($scope, $http) {

  
    $http.get('/api/getReport').success(function(res){
    $scope.reports = res;
    console.log($scope.reports);
    if(res == "0"){
      $scope.msg = "No report found";
    }
	  
  })


    $scope.parentRecomm = function(){

      $scope.msg = "";
    $scope.msg1 = "";
    var standard=$scope.standard;
    var section=$scope.section;
    var subject=$scope.subject;
    
    var data={"class":standard, "subject":subject, "section":section};
    console.log(data);

    $http.get('/api/getRecomm',{ params: data }).success(function(res){
    $scope.recommendations = res;
    if(res == "0"){
      $scope.msg1 = "No Data found. Wrong Class combination or student has not taken his/her assesment";
    }
    console.log($scope.recommendations);
    
  })

}

});
