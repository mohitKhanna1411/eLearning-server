// creating the module
var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
myApp.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/dashboardParent', {
    templateUrl : '/views/parent/reportParent.html',
    controller  : 'controllerParent'
  })
  .when('/reportParent', {
    templateUrl : '/views/parent/reportParent.html',
    controller  : 'controllerParent'
  })
  .when('/recommendationParent', {
    templateUrl : '/views/parent/recommendationParent.html',
    controller  : 'controllerParent'
  });
  $locationProvider.html5Mode(true);
});

// creating mainController
myApp.controller('controllerParent', function($scope, $http) {

  
  $http.get('/api/getReport').success(function(res){
    $scope.reports = res;
    console.log($scope.reports);
    if(res.length === 0){
      $scope.msg = "No reports found";
    }
    
  })


  $scope.parentRecomm = function(myselect){
// console.log(myselect);
$scope.msg = "";
$scope.msg2 = "";
var standard=$scope.standard;
var section=$scope.section;
var subject=$scope.subject;

var data={"class":standard, "subject":subject, "section":section, "assesment_name" : myselect};
console.log(data);

$http.get('/api/parent/getRecomm',{ params: data }).success(function(res){
  $scope.recommendations = res;
  if(res.length === 0){
    $scope.msg2 = "Student has not taken his/her assesment or is not enrolled in this class!";
  }
  console.log($scope.recommendations);

})

}


$scope.getAllAssign= function()
{
  $scope.msg = "";
  $scope.msg1 = "";
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;
  
  var data={"class":standard, "subject":subject, "section":section};
  console.log(data);
  $http.get('/api/getAllAssign', { params: data }).success(function(res){
    $scope.assesments = res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No assesment found or you child is not enrolled in this class!";
      $scope.ok = "not";
    }else{
      $scope.ok = "ok";
      // $scope.msg1 = res.length + " assesments found.";
      if(res.length == 0){
        $scope.ok = "not";
        $scope.msg1 = "Assesment yet to be added. Please come again later!";    
      }
    }
  })
}


});
