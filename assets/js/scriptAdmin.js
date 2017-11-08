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
    .when('/assesmentAdmin', {
      templateUrl : '/views/assesmentAdmin.html',
      controller  : 'controllerAdmin'
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







$scope.ok = "not";
$scope.lessons= function()
  {
    $scope.ok = "not";
        $scope.msg = "";
        $scope.msg1 = "";
    var standard=$scope.standard;
    var section=$scope.section;
    var subject=$scope.subject;
    
    var data={"class":standard, "subject":subject, "section":section};
                console.log(data);
     $http.get('/api/getlessons', { params: data }).success(function(res){
        $scope.list = res;
        if(res == "0"){
            $scope.msg1 = "No lessons found in this class. Please Add one first!";
            $scope.ok = "not";
        }else{
            $scope.msg1 = res.length + " Number of lessons found. Please Add Questions in Assignment for this class";
            $scope.ok = "ok";
          }
    })
    
  }


 $scope.optionsArr = [];
 $scope.contents = [];
 var data ={};
  $scope.addAssesment= function(data)
  {
        $scope.msg = "";
        console.log(data.right_answer);
        console.log($scope.optionsArr);
        console.log(data.question);
        // console.log($scope.standard);
        // console.log($scope.section);
        // console.log($scope.subject);
        for(var i=0 ; i< 4 ; i++){
          if($scope.optionsArr[i] == data.right_answer){
            $scope.contents.push({
                answerText: $scope.optionsArr[i],
                correct: true
            });
          }else{
            $scope.contents.push({
                answerText: $scope.optionsArr[i],
                correct: false
            });
          }

        }
        console.log($scope.contents)

    var sendData={"question": data.question, "class": $scope.standard, "subject": $scope.subject, "section": $scope.section , "options": $scope.contents , "lesson_id": data.lesson_id};
                console.log(sendData);
     $http.post('/api/teacher/addQues', sendData).success(function(res){
      $scope.msg = res;
       $scope.optionsArr = [];
      $scope.contents = [];
      data = "";
    })

    
  }























  });
