// creating the module
var myApp = angular.module('myApp', ['ngRoute' , 'ngFileUpload']);
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
  .when('/remedialLessonsAdmin', {
    templateUrl : '/views/remedialLessonsAdmin.html',
    controller  : 'controllerAdmin'
  })
  .when('/viewClasses', {
    templateUrl : '/views/viewClasses.html',
    controller  : 'controllerAdmin'
  })
  .when('/assesmentAdmin', {
    templateUrl : '/csvupload.html',
    controller  : 'controllerAdmin'
  })
  .when('/createErrorCodes', {
    templateUrl : '/views/createErrorCodes.html',
    controller  : 'controllerAdmin'
  })
  .when('/createLessonAdmin', {
    templateUrl : '/views/createLessonAdmin.html',
    controller  : 'controllerAdmin'
  })
  .when('/createRemedialLessonAdmin', {
    templateUrl : '/views/createRemedialLessonAdmin.html',
    controller  : 'controllerAdmin'
  })
  .when('/showErrorCodes', {
    templateUrl : '/views/showErrorCodes.html',
    controller  : 'controllerAdmin'
  })
  .when('/recommendationAdmin', {
    templateUrl : '/views/recommendationAdmin.html',
    controller  : 'controllerAdmin'
  })
  .when('/deleteUsers', {
    templateUrl : '/views/deleteUsers.html',
    controller  : 'controllerAdmin'
  })
  .when('/overallRecommendation', {
    templateUrl : '/views/overallRecommendation.html',
    controller  : 'controllerAdmin'
  })
  .otherwise({
    redirectTo: '/dashboardAdmin'
  });
  $locationProvider.html5Mode(true);
});

myApp.filter('trusted', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);





myApp.directive('fileReaderDirective', function() {
    return {
        restrict: "A",
        scope: {
            fileReaderDirective: "=",
        },
        link: function(scope, element) {
            $(element).on('change', function(changeEvent) {
                var files = changeEvent.target.files;
                if (files.length) {
                    var r = new FileReader();
                    r.onload = function(e) {
                        var contents = e.target.result;
                        scope.$apply(function() {
                            scope.fileReaderDirective = contents;
                        });
                    };
                    r.readAsText(files[0]);
                }
            });
        }
    };
});





myApp.factory('readFileData',['$http', function($http) {
    return {
        processData: function(csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(',');
            var lines = [];
            var json = {};

            for (var i = 0; i < record.length; i++) {
                var data = record[i].split(',');
                if (data.length == headers.length) {
                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                    //lines=lines.replace('\\','');
                }
            }
            
            for (var k = 0; k < lines.length; ++k){
              json[k] = lines[k];
            }
          
            // var stringified = JSON.stringify(json);
            // stringified = stringified.replace('"\\": ""');
            // stringified = stringified;
            // var jsonObject = JSON.parse(stringified);
            // console.log(jsonObject[2][0].replace(/^"(.*)"$/, '$1'));
            // var data1=[];
            var dataFinal =[];
            // console.log(lines.length);
            // console.log(headers.length);
            // return json;
            for(i=0;i<lines.length;i++){
                
                var data1=[];
                var obj={};
                 var k=5;
                 for(j=1;j<5;j++){
                    if(json[i][k].replace(/^"(.*)"$/, '$1')==="ERT"){
                        obj= {
                            answerText : json[i][j].replace(/^"(.*)"$/, '$1'),
                            correct : true,
                            error_code : json[i][k].replace(/^"(.*)"$/, '$1')
                        };

                    }
                    else{
                          obj={
                         answerText : json[i][j].replace(/^"(.*)"$/, '$1'),
                         correct : false,
                         error_code : json[i][k].replace(/^"(.*)"$/, '$1')
                          };

                    }//else
                    k++;
                 data1.push(obj);
                 } // j loop closed
                  
                 dataFinal.push({
                  options : data1,
                  questionText : json[i][0].replace(/^"(.*)"$/, '$1') 
                });
            }   // i loop closed         
            console.log(dataFinal);
            // var sendData={ "assesment_name" :$scope.assesment_name, "lesson_title": $scope.les_title, "questions":dataFinal} ;
            // console.log(sendData);
            return dataFinal;
        }
    };
}]);

// creating mainController
myApp.controller('controllerAdmin',['$scope','Upload','$window','$http',
  'readFileData', function($scope,Upload,$window, $http,readFileData) {
      $scope.fileDataObj = {};
      $scope.message = null;
 $scope.uploadFile = function() {
      if ($scope.fileContent) {
        $scope.fileDataObj = readFileData.processData($scope.fileContent);
        console.log($scope.fileDataObj);
        if($scope.fileDataObj){
          $scope.message = "File Uploaded Successfully,Please Select class to create this assesment!";
        }else{
          $scope.message = "Error!! Please try again later";
        }
      }
    }

 $scope.addAssesmentFunc = function(title_lesson , assesment_name , var_class , var_section , var_subject) {
      // console.log($scope.fileDataObj);
      // console.log(assesment_name);
      // console.log(title_lesson);
     $scope.msg4 =null;
      var sendData = {};
      var dataObj = {};
      dataObj = {
        "assesment_name" : assesment_name,
        "lesson_title" : title_lesson,
        "questions"  : $scope.fileDataObj
      }

     
      console.log(dataObj);
      sendData = {
        "class":var_class,
        "section":var_section,
        "subject" : var_subject,
        "dataObj" : dataObj

      }
      console.log(sendData);
      $http.post('/api/admin/addAssesment', sendData).success(function(res){
     console.log(res);  
     $scope.msg4 = res;    
       })


    }


 $http.get('/api/getStudents').success(function(res){
  $scope.list1 = res;
})

 $http.get('/api/getTeachers').success(function(res){
  $scope.list2 = res;
})

 $http.get('/api/getParents').success(function(res){
  $scope.list3 = res;
  // console.log(res);
})
 $http.get('/api/getClasses').success(function(res){
  $scope.list4 = res;
  console.log("classes"  + res[0].students);
})

 $http.get('/api/listStudentIDs').success(function(res){
  $scope.options = res;
  // console.log($scope.options[0]._id);
})
$http.get('/api/listTeacherIDs').success(function(res){
  $scope.options1 = res;
  // console.log($scope.options[0]._id);
})
$http.get('/api/listParentIDs').success(function(res){
  $scope.options2 = res;
  // console.log($scope.options[0]._id);
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
    }if(res.length == 0){
      $scope.msg1 = "No lessons found!, Please add lessons to continue";
      $scope.ok = "not";
    }else{
      $scope.msg1 = " Number of lessons found : " + res.length ;
      $scope.ok = "ok";
    }
  })

}

 
 $scope.remedialLessons= function()
 {
  $scope.ok = "not";
  $scope.msg = "";
  $scope.msg1 = "";
  var standard=$scope.standard;
  var section=$scope.section;
  var subject=$scope.subject;

  var data={"class":standard, "subject":subject, "section":section};
  console.log(data);
  $http.get('/api/admin/getremedialLessons', { params: data }).success(function(res){
    $scope.list = res;
    console.log(res);
    if(res == "0"){
      $scope.msg1 = "No Class found, Please create a class and add remedial lessons!";
      $scope.ok = "not";
    }if(res.length == 0){
      $scope.msg1 = "No remedial lessons found!, Please add lessons to continue";
      $scope.ok = "not";
    }else{
      $scope.msg1 = " Number of Remedial lessons found : " + res.length ;
      $scope.ok = "ok";
    }
  })

}
// $scope.optionsArr = [];
// $scope.errorArr = [];
// $scope.errorArr[3] = "Right Answer";
// $scope.codeArr = [];
// $scope.contents = [];
// var data ={};

// $scope.addAssesment= function(data)
// { 
//   $scope.msg = "";
//   console.log("RA " + data.right_answer);
//   console.log("op : " + $scope.optionsArr);
//   console.log("q : " + data.question);
//   console.log("CODE : " + $scope.codeArr);
//         // console.log($scope.standard);
//         // console.log($scope.section);
//         // console.log($scope.subject);
//         for(var i=0 ; i< 4 ; i++){
//           if($scope.optionsArr[i] == data.right_answer){
//             $scope.contents.push({
//               answerText: $scope.optionsArr[i],
//               correct: true,
//               error_lesson_title: $scope.codeArr[i]
//             });
//           }else{
//             $scope.contents.push({
//               answerText: $scope.optionsArr[i],
//               correct: false,
//               error_lesson_title: $scope.codeArr[i]
//             });
//           }

//         }
//         console.log("CONTENTS : " + $scope.contents)

//         var sendData={ "question": data.question, "class": $scope.standard, 
//         "subject": $scope.subject, "section": $scope.section , 
//         "options": $scope.contents};
//         console.log(sendData);
        // $http.post('/api/admin/addQues', sendData).success(function(res){
        //   $scope.msg = res;
        //   $scope.optionsArr = [];
        //   $scope.errorArr = [];
        //   $scope.errorArr[3] = "Right Answer";
        //   $scope.contents = [];
        //   $scope.codeArr = [];
        //   data.right_answer = "";
        //   data.question = "";
        //   data.lesson_id = "";
        // })


//       }

$scope.syncVideo= function(){
  $scope.ref_link = "";
}
$scope.syncLink= function(){
  $scope.file = "";
}


    $scope.addinglessons= function(file)
      {
              $scope.progressPercentage = 0;
               $scope.progress = "";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard2;
        var section=$scope.section2;
        var subject=$scope.subject2;
        var content=$scope.content;
        var title=$scope.lesson_title;
        var ref_link=$scope.ref_link;
        var data={"class":standard, "subject":subject, "section":section,
        "title":title,"content":content,"ref_link":ref_link, "file" : file};
        console.log(data);
        Upload.upload({
          url   : '/api/teacher/addlessons', 
          data  : data //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            $scope.msg1 = resp.data;
            $scope.content = "";
            $scope.ref_link = "";
            $scope.lesson_title ="";
            $scope.file = "";

        }, function (resp) {
            $scope.msg1 = 'Error status: ' + resp.status;
            $scope.content = "";
            $scope.ref_link = "";
            $scope.lesson_title ="";

        }, function (evt) { 
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'uploading progress: ' + $scope.progressPercentage + '%'; // capture upload progress
        });



      }

    $scope.addingRemedialLessons= function(file)
      {
              $scope.progressPercentage = 0;
               $scope.progress = "";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard2;
        var section=$scope.section2;
        var subject=$scope.subject2;
        var content=$scope.content;
        var title=$scope.lesson_title;
        var ref_link=$scope.ref_link;
        var data={"class":standard, "subject":subject, "section":section,
        "title":title,"content":content,"ref_link":ref_link, "file" : file};
        console.log(data);
        Upload.upload({
          url   : '/api/admin/addRemedialLessons', 
          data  : data //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            $scope.msg1 = resp.data;
            $scope.content = "";
            $scope.ref_link = "";
            $scope.lesson_title ="";
            $scope.file = "";

        }, function (resp) {
            $scope.msg1 = 'Error status: ' + resp.status;
            $scope.content = "";
            $scope.ref_link = "";
            $scope.lesson_title ="";

        }, function (evt) { 
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progress = 'uploading progress: ' + $scope.progressPercentage + '%'; // capture upload progress
        });



      }

      $scope.addingErrorCodes= function(error_c , title)
      {
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;
        console.log(error_c);
        console.log(title);
        
        var data={"class":standard, "subject":subject, "section":section,"error_code":error_c,"title":title};
        console.log(data);
        $http.post('/api/admin/addErrorCodes', data).success(function(res){
          $scope.msg = res;
          $scope.error_c="";
        
        })


      }

      $scope.ok = "not";
      $scope.findErrorCodes= function()
      {
        $scope.ok = "not";
        $scope.msg = "";
        $scope.msg1 = "";
        var standard=$scope.standard;
        var section=$scope.section;
        var subject=$scope.subject;

        var data={"class":standard, "subject":subject, "section":section};
        console.log(data);
        $http.get('/api/getErrorCodes', { params: data }).success(function(res){
          $scope.err = res;
     
         
          console.log(res);
          if(res == "0"){
            $scope.msg1 = "No Error Codes found in this class, Please create error codes for this class combination!";
            $scope.ok = "not";
          }else{
          //     var right="Right Answer";
          // var obj = {
          // error_code : right,
          // remedial_title : right
          //         };
          //   $scope.err.push(obj);
          // console.log(res);
            $scope.msg1 = res.length + " Error Codes Found!";
            $scope.ok = "ok";

          }
        })

      }

    $scope.stuID = "";
$scope.adminRecommend= function()
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
    $scope.recommend=res;
    console.log(res);
   if(res == "0"){
      $scope.msg1 = "No Recommendations/Assesments Found in this combination";
      $scope.ok = "not";
    }else{

      $scope.ok = "ok";
    }
  
  })
  
}



$scope.deleteStudent= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";

        $scope.msg2 = "";

        var studentID=$scope.stu_id;
        var data={"student_id":studentID};
        console.log(data);
        $http.post('/api/admin/deleteStudent', data).success(function(res){
          $scope.msg = res;

          $scope.msg1 = "";
        $scope.msg2 = "";
          $scope.stu_id = "";
        })

        
      }


$scope.deleteTeacher= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";

        $scope.msg2 = "";

        var teacherID=$scope.tea_id;
        var data={"teacher_id":teacherID};
        console.log(data);
        $http.post('/api/admin/deleteTeacher', data).success(function(res){

          $scope.msg1 = res;
          $scope.msg = "";
        $scope.msg2 = "";

          $scope.tea_id = "";
        })

        
      }


      $scope.deleteParent= function()
      {
        $scope.msg = "";
        $scope.msg1 = "";

        $scope.msg2 = "";

        var parentID=$scope.par_id;
        var data={"parent_id":parentID};
        console.log(data);
        $http.post('/api/admin/deleteParent', data).success(function(res){

          $scope.msg2 = res;
          $scope.msg1 = "";
        $scope.msg = "";

          $scope.par_id = "";
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
        overall.push($scope.summary[i][j].lesson_title);

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


    }]);
