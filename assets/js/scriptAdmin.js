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
  })
  .when('/createLessonAdmin', {
    templateUrl : '/views/createLessonAdmin.html',
    controller  : 'controllerAdmin'
  });
  $locationProvider.html5Mode(true);
});

myApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);


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

 $http.get('/api/listStudentIDs').success(function(res){
  $scope.options = res;
  console.log($scope.options[0]._id);
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
  $http.get('/api/admin/getlessons', { params: data }).success(function(res){
    $scope.list = res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No Class found, Please create a class and add lessons!";
      $scope.ok = "not";
    }else{
      $scope.msg1 = res.length + " Number of lessons found.";
      $scope.ok = "ok";
    }
  })

}


$scope.optionsArr = [];
$scope.errorArr = [];
$scope.errorArr[3] = "Right Answer";
$scope.codeArr = [];
$scope.contents = [];
var data ={};

$scope.addAssesment= function(data)
{
  $scope.msg = "";
  console.log("RA " + data.right_answer);
  console.log("op : " + $scope.optionsArr);
  console.log("q : " + data.question);
  console.log("CODE : " + $scope.codeArr);
        // console.log($scope.standard);
        // console.log($scope.section);
        // console.log($scope.subject);
        for(var i=0 ; i< 4 ; i++){
          if($scope.optionsArr[i] == data.right_answer){
            $scope.contents.push({
              answerText: $scope.optionsArr[i],
              correct: true,
              error_code : $scope.codeArr[i]
            });
          }else{
            $scope.contents.push({
              answerText: $scope.optionsArr[i],
              correct: false,
              error_code : $scope.codeArr[i]
            });
          }

        }
        console.log("CONTENTS : " + $scope.contents)

        var sendData={ "question": data.question, "class": $scope.standard, 
        "subject": $scope.subject, "section": $scope.section , 
        "options": $scope.contents , "lesson_id": data.lesson_id };
        console.log(sendData);
        $http.post('/api/teacher/addQues', sendData).success(function(res){
          $scope.msg = res;
          $scope.optionsArr = [];
          $scope.errorArr = [];
          $scope.errorArr[3] = "Right Answer";
          $scope.contents = [];
          $scpe.codeArr = [];
          data = "";
        })


      }




      $scope.addinglessons= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard2;
        var section=$scope.section2;
        var subject=$scope.subject2;
        var content=$scope.content;
        var ref_link=$scope.ref_link;
        var data={"class":standard, "subject":subject, "section":section,"content":content,"ref_link":ref_link};
        console.log(data);
        $http.post('/api/teacher/addlessons', data).success(function(res){
          $scope.msg1 = res;
          $scope.content = "";
          $scope.ref_link = "";
        })


      }

    });
