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
    controller  : 'controllerStudent'
  })
  .when('/recommendationStudent', {
    templateUrl : '/views/recommendationStudent.html',
    controller  : 'controllerStudent'
  });
  $locationProvider.html5Mode(true);
});


myApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);



// creating mainController
myApp.controller('controllerStudent', function($scope, $http) {

 $scope.ok = "not";
 $scope.lessons= function()
 {
  $scope.msg = "";
  $scope.msg1 = "";
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;
  
  var data={"class":standard, "subject":subject, "section":section};
  console.log(data);
  $http.get('/api/student/getlessons', { params: data }).success(function(res){
   $scope.list = res;
   if(res == "0"){
    $scope.msg1 = "No lessons found or you are not enrolled in this class!";
    $scope.ok = "not";
  }else{
    $scope.msg1 = res.length + " Number of lessons found.";
    $scope.ok = "ok";
  }
  console.log($scope.list);
})

  
}



$scope.ok = "not";
$scope.getAssignment= function()
{
  $scope.msg = "";
  $scope.msg1 = "";
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;
  
  var data={"class":standard, "subject":subject, "section":section};
  console.log(data);
  $http.get('/api/getAssign', { params: data }).success(function(res){
    $scope.questions = res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No assesment found or you are not enrolled in this class!";
      $scope.ok = "not";
    }else{
      $scope.ok = "ok";
      $scope.msg1 = res.length + " Number of questions found.";
      if(res.length == 0){
        $scope.ok = "not";
        $scope.msg1 = "Assesment yet to be added. Please come again later!";    
      }
    }
  })

  
}

$scope.ok = "not";
$scope.getResults= function()
{
  $scope.msg = "";
  $scope.msg1 = "";
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;
  
  var data={"class":standard, "subject":subject, "section":section};
  console.log(data);
  $http.get('/api/getRes', { params: data }).success(function(res){
    $scope.list = res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No results found or you are not enrolled in this class!";
      $scope.ok = "not";
    }else{
            // $scope.msg1 = res.length + " Number of lessons found.";
            $scope.ok = "ok";
          }
        })
  
}



$scope.hide = false ;
$scope.answers ={};
$scope.correctCount = 0;
$scope.showResult = function(){
  var errors=[];
  var error_lesson=[];
  $scope.hide = false ;
  $scope.correctCount = 0;
  var qLength = $scope.questions.length;
  for(var i=0;i<qLength;i++){
    var answers = $scope.questions[i].options;
    console.log(answers);
    $scope.questions[i].userAnswerCorrect = false;
    $scope.questions[i].userAnswer = $scope.answers[i];
    for(var j=0;j<answers.length;j++){
       // answers[j].selected = "donno";
       if ($scope.questions[i].userAnswer === answers[j].answerText && answers[j].correct===true){
        $scope.questions[i].userAnswerCorrect = true;
        answers[j].selected = "true";
        $scope.correctCount++;
      }else if($scope.questions[i].userAnswer === answers[j].answerText && answers[j].correct===false){
        answers[j].selected = "false";
        var obj = {
          question : $scope.questions[i].question,
          response : $scope.questions[i].userAnswer,
          error_lesson_title : answers[j].error_lesson_title
                  };

         error_lesson.push(answers[j].error_lesson_title);
        
        errors.push(obj);
        
        console.log(errors);
        console.log(errors.length);
      }
    }
  }
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;
  var sendData = {  "count" : $scope.correctCount +" out of "+ $scope.questions.length , 
  "class":standard, "section":section, "subject":subject,
  "recommendations" : errors ,"lessons": error_lesson                 
}
$scope.ql = qLength;
console.log(sendData);
$http.post('/api/addResults', sendData).success(function(res){
  $scope.msg = res;
  $scope.hide = true;
       // $scope.optionsArr = [];
      // $scope.contents = [];
      // data = "";
      // $scope.questions = [] ;
    })
}
});
