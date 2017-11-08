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

// creating mainController
myApp.controller('controllerStudent', function($scope, $http) {

 
  $scope.lessons= function()
  {
    $scope.msg = "";
    $scope.msg1 = "";
    var standard=$scope.standard;
    var section=$scope.section;
    var subject=$scope.subject;
    
    var data={"class":standard, "subject":subject, "section":section};
    console.log(data);
    $http.get('/api/getlessons', { params: data }).success(function(res){
     $scope.list = res;
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
      $scope.ok="ok";
    })

    
  }


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
        // console.log("res" + res);
         // $scope.ok="ok";
       })
    
  }
  
  


  $scope.answers ={};
  $scope.correctCount = 0;
  $scope.showResult = function(){
    var errors=[];
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
        if (errors.indexOf($scope.questions[i].lesson_id) == -1) {
          errors.push($scope.questions[i].lesson_id);
        }
        
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
  "recommendations" : errors                      
}
$scope.ql = qLength;
console.log(sendData);
$http.post('/api/addResults', sendData).success(function(res){
  $scope.msg = res;
       // $scope.optionsArr = [];
      // $scope.contents = [];
      // data = "";
      $scope.questions = [] ;
    })




}



});
