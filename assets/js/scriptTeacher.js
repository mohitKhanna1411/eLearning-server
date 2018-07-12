// creating the module
var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
myApp.config(function($routeProvider, $locationProvider){
  $routeProvider
  .when('/dashboardTeacher', {
    templateUrl : '/views/teacher/manageGradeTeacher.html',
    controller  : 'controllerTeacher'
  })
  .when('/manageGradeTeacher', {
    templateUrl : '/views/teacher/manageGradeTeacher.html',
    controller  : 'controllerTeacher'
  })

  .when('/lessonsTeacher', {
    templateUrl : '/views/teacher/lessonsTeacher.html',
    controller  : 'controllerTeacher'
  })
  .when('/assesmentTeacher', {
    templateUrl : '/views/teacher/assesmentTeacher.html',
    controller  : 'controllerTeacher'
  })
  .when('/viewStudents', {
    templateUrl : '/views/teacher/viewStudents.html',
    controller  : 'controllerTeacher'
  })
  .when('/overallRecommend', {
    templateUrl : '/views/teacher/overallRecommend.html',
    controller  : 'controllerTeacher'
  })
  .when('/teacherRecommend', {
    templateUrl : '/views/teacher/teacherRecommend.html',
    controller  : 'controllerTeacher'
  });
  $locationProvider.html5Mode(true);
});

myApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);



// creating mainController
myApp.controller('controllerTeacher', function($scope, $http,$window) {

  $http.get('/api/listStudentIDs').success(function(res){
    $scope.options = res;
    console.log($scope.options);
  })
  $http.get('/api/getClasses').success(function(res){
    $scope.list4 = res;
    console.log(res);
  })

  $http.get('/api/teacher/getLastLesson').success(function(res){
   
    if(res.last_lesson){
     $scope.lastLessonTeacher = res.last_lesson; 
   }
   else{
    $scope.lastLessonTeacher = "No lesson"; 
  }
  // console.log($scope.lastLessonTeacher);
})

  $scope.msg1 = ""
  $scope.msg = "";
  $scope.manageGrade= function()
  {
    $scope.msg1 = ""
    $scope.msg = "";
    console.log("inside manageGrade");
    var standard=$scope.standard;
    var section=$scope.section;
    var subject=$scope.subject;
    var data={"class":standard, "section":section, "subject":subject};
    console.log("data "+data);
    $http.post('/api/teacher/manageGrade', data).success(function(res){
      $scope.msg = res;
      $scope.standard = "";
      $scope.section ="";
      $scope.subject = "";
    })
    
  }


  $scope.notok = "not";
  $scope.getSpecificLessonTeacher= function(title_lesson)
  {
    
    $scope.msg = "";
    $scope.msg1 = "";
    $scope.msg2="";
    $scope.msg4="";
    
    var data={"Title" : title_lesson};
    console.log(data);
    $http.get('/api/teacher/getSpecificLesson', { params: data }).success(function(res){
      $scope.notok="ok";
      $scope.list5 = res;
      
      console.log(res);
      
    })

    
  }



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
    $http.get('/api/teacher/getlessons', { params: data }).success(function(res){
      $scope.list1 = res;
      if(res === "0"){
      $scope.msg1 = "No lesson found!";
      $scope.ok = "not";
      return;
    }if(res.length === 0){
      $scope.msg1 = "No lesson found!";
      $scope.ok = "not";
      return;
    }else{
      $scope.msg1 = " Number of lessons found : " + res.length ;
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


      $scope.addingStudent= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard1;
        var section=$scope.section1;
        var subject=$scope.subject1;
        var studentID=$scope.studentID;
        var data={"class":standard, "subject":subject, "section":section, "student":studentID};
        console.log(data);
        $http.post('/api/teacher/addStudent', data).success(function(res){
          $scope.msg1 = res;
          $scope.studentID = "";
        })

        
      }

      $scope.deletingStudent= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard1;
        var section=$scope.section1;
        var subject=$scope.subject1;
        var studentID=$scope.studentID;
        var data={"class":standard, "subject":subject, "section":section, "student":studentID};
        console.log(data);
        $http.post('/api/teacher/deleteStudent', data).success(function(res){
          $scope.msg1 = res;
          
          $scope.studentID = "";
        })

        
      }

      $scope.stuID = "";
      $scope.teacherRecommend= function()
      {
        $scope.ok = "not";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        var studentID=$scope.stuID;
        console.log("id:  " + $scope.stuID); 
        
        var data={"class":standard, "subject":subject, "section":section,"student_id":studentID};
        console.log("data   " +data);
        $http.get('/api/teacher/getRes', { params: data }).success(function(res){
    //$scope.recommend=res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No Recommendations/Assesments Found in this combination";
      $scope.ok = "not";
    }else{

      $scope.ok = "ok";
    }
    
  })
        
      }


      $scope.viewStudents= function()
      {
        $scope.ok = "not";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        
        var data={"class":standard, "subject":subject, "section":section};
        console.log(data);
        $http.get('/api/getClassStudents', { params: data }).success(function(res){
         $scope.list2= res;
         console.log($scope.list2);
         $scope.ok = "ok";
       })

        
      }




      $scope.ok = "not";
      $scope.overallRecommend= function()
      {
        $scope.ok = "not";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        
        var data={"class":standard, "subject":subject, "section":section};
        console.log(data);
        $http.get('/api/getOverallRecommend', { params: data }).success(function(res){
          $scope.summary = res;
          
          if(res == "0"){
            $scope.msg1 = "No lessons found.";
            $scope.ok = "not";
          }else{
            $scope.msg1 = " Result Found";
            $scope.ok = "ok";

            var overall = [];
     // angular.forEach($scope.summary, function(element) {
     //   overall.push(element);
     //   });

     for(var i = 0 ; i < $scope.summary.length ; i++){
      for(var j = 0 ; j < Object.keys($scope.summary[i]).length ; j++){
        // console.log($scope.summary[i][j].lesson_title);
        overall.push($scope.summary[i][j].remedial_lesson_title);

      }
    }

    console.log("overall  " + overall);
    // console.log("summ  "   + $scope.summary);




    function foo(arr) {
      var a = [], b = [], prev;
      
      arr.sort();
      for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
          a.push(arr[i]);
          b.push(1);
        } else {
          b[b.length-1]++;
        }
        prev = arr[i];
      }
      
      return [a, b];
    }
    $scope.list2=[];

    var result = foo(overall);
    for ( var i = 0; i < result[0].length; i++ ) {
      
      $scope.list2.push({
        les_title : result[0][i],
        num_rec :result[1][i]
      });

      }//for loop




    }//else
  })
        
      }

      $scope.ok = "not";
      $scope.getAllAssign= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        var studentID=$scope.stuID;
        
        var data={"class":standard, "subject":subject, "section":section, student :studentID };
        console.log(data);
        $http.get('/api/teacher/getAllAssign', { params: data }).success(function(res){
          $scope.assesments = res;
          console.log(res);
          if(res == "0"){
            $scope.msg1 = "No assessments found to give recommends for!";
            $scope.ok = "not";
          }else{
            $scope.ok = "ok";
            $scope.msg1 = res.length + " assesments found.";
            if(res.length == 0){
              $scope.ok = "not";
              $scope.msg1 = "Assesment yet to be added. Please come again later!";    
            }
          }
        })
      }


      $scope.notok = "not";
      $scope.getResults= function(assess_name)
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        var studentID=$scope.stuID;
        
        var data={"class":standard, "subject":subject, "section":section, "assesment_name" : assess_name,"student":studentID};
        console.log(data);
        $http.get('/api/teacher/getRes', { params: data }).success(function(res){
          $scope.recommend = res;
          console.log(res);
          if(res == "0"){
            $scope.msg1 = "No results found!";
            $scope.notok = "not";
          }else{
            // $scope.msg1 = res.length + " Number of lessons found.";
            $scope.notok = "ok";
            $scope.okok="ok";
          }
        })
        
      }
      
    });
