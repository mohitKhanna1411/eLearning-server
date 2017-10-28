var mainApp = angular.module('mainApp', ['ui.bootstrap']);
//mainController
mainApp.controller('mainController', function($scope,$http) {

      //default image to prevent atl text
      $scope.Patient_Image = '/examples/images/Logo.png';
      // sliders for image manipulation
      $scope.min = 50;
      $scope.max = 200;
      $scope.brightness = 100;
      $scope.contrast = 100;
      $scope.minHue = 0;
      $scope.maxHue = 90;
      $scope.hueRotate = 0;

      var inputMin = 4;
      $scope.someVal = '';
      $scope.message = null;
  //searching function
  $scope.searchFunc = function() {
    //calling node api only when input length >= 4
    if ($scope.someVal.length >= inputMin) searchSomething()
  };
  function searchSomething() {
    //searchbox get api
    $http.get('/api/searchBox', { params: { regex : $scope.someVal } }).success(function(res){
      $scope.states = res;
    })
  }; 
//searchClick function called to get info by id
  $scope.searchClick = function(value) {
      $scope.message = null;
      // sliders for image manipulation
      $scope.min = 50;
      $scope.max = 200;
      $scope.brightness = 100;
      $scope.contrast = 100;
      $scope.minHue = 0;
      $scope.maxHue = 90;
      $scope.hueRotate = 0;
      var selectVal = value.Patient_ID;

  //getInfoByID get api
  $http.get('/api/getInfoByID', { params: { id : selectVal } }).success(function(res){
  //initailizing variables 

      console.log(res);

      $scope.Patient_Age = res[0].Patient_Age;
      $scope.Patient_Analyzed = res[0].Patient_Analyzed;
      $scope.Patient_Date = res[0].Patient_Date;
      $scope.Patient_Diabetic = res[0].Patient_Diabetic;
      $scope.Patient_Diagnosis = res[0].Patient_Diagnosis;
      $scope.Patient_Eye = res[0].Patient_Eye;
      $scope.Patient_Hardware = res[0].Patient_Hardware;
      $scope.Patient_ID = res[0].Patient_ID;
      $scope.Patient_Name = res[0].Patient_Name;
      $scope.Patient_Referral = res[0].Patient_Referral;
      //image info
      $scope.Patient_Image_Analyzed_Right = res[0].Patient_Image_Analyzed_Right;
      $scope.Patient_Image_Raw_Right = res[0].Patient_Image_Raw_Right;
      $scope.Patient_Image_Analyzed_Left = res[0].Patient_Image_Analyzed_Left;
      $scope.Patient_Image_Raw_Left = res[0].Patient_Image_Raw_Left;

      $scope.Patient_Yellow_Lesion_Right = res[0].Patient_Yellow_Lesion_Right;
      $scope.Patient_Red_Lesion_Right = res[0].Patient_Red_Lesion_Right;
      $scope.Patient_Yellow_Lesion_Left = res[0].Patient_Yellow_Lesion_Left;
      $scope.Patient_Red_Lesion_Left = res[0].Patient_Red_Lesion_Left;

      //default image right
      $scope.Patient_Image = $scope.Patient_Image_Raw_Right ;
      $scope.param = "Right";
      $scope.Patient_Yellow_Lesion = $scope.Patient_Yellow_Lesion_Right;
      $scope.Patient_Red_Lesion = $scope.Patient_Red_Lesion_Right;
    })
};

  $scope.annoted = function() {
      $scope.message = null;
      // sliders for image manipulation
      $scope.min = 50;
      $scope.max = 200;
      $scope.brightness = 100;
      $scope.contrast = 100;
      $scope.minHue = 0;
      $scope.maxHue = 90;
      $scope.hueRotate = 0;
      //setting values image of Right/Left eye
      if($scope.param == "Right")
        $scope.Patient_Image = $scope.Patient_Image_Analyzed_Right ;
      else if($scope.param == "Left")
        $scope.Patient_Image = $scope.Patient_Image_Analyzed_Left ;
    };

  $scope.right = function() {
      $scope.message = null;
      // sliders for image manipulation
      $scope.min = 50;
      $scope.max = 200;
      $scope.brightness = 100;
      $scope.contrast = 100;
      $scope.minHue = 0;
      $scope.maxHue = 90;
      $scope.hueRotate = 0;
      //setting values as right
      $scope.param = "Right";
      $scope.Patient_Image = $scope.Patient_Image_Raw_Right ;
      $scope.Patient_Yellow_Lesion = $scope.Patient_Yellow_Lesion_Right;
      $scope.Patient_Red_Lesion = $scope.Patient_Red_Lesion_Right;
    };

  $scope.left = function() {

      $scope.message = null;
      // sliders for image manipulation
      $scope.min = 50;
      $scope.max = 200;
      $scope.brightness = 100;
      $scope.contrast = 100;
      $scope.minHue = 0;
      $scope.maxHue = 90;
      $scope.hueRotate = 0;
      //setting values as left
      $scope.param = "Left" ;
      $scope.Patient_Image = $scope.Patient_Image_Raw_Left ;
      $scope.Patient_Yellow_Lesion = $scope.Patient_Yellow_Lesion_Left;
      $scope.Patient_Red_Lesion = $scope.Patient_Red_Lesion_Left;
    };

  $scope.agree = function() {
      $scope.message = null;
      //checking selected value and calling api
      if($scope.param =="Right")
        $http.get('/api/agreement', { params: { id : $scope.Patient_ID , item : $scope.param } }).success(function(res){
          if(res.n == "1"){
            $scope.message = "Right eye info AGREED";
          }     
          else{
            $scope.message = "Please try again later!";
          }
        })
  //checking selected value and calling api
  if($scope.param =="Left")
    $http.get('/api/agreement', { params: { id : $scope.Patient_ID , item : $scope.param } }).success(function(res){
      if(res.n == "1"){
        $scope.message = "Left eye info AGREED";
      }            
      else{
        $scope.message = "Please try again later!";
      }
    })
};

  $scope.disagree = function() {
    $scope.message = null;
      //checking selected value and calling api
      if($scope.param =="Right")
       $http.get('/api/disagreement', { params: { id : $scope.Patient_ID , item : $scope.param } }).success(function(res){
        if(res.n == "1"){
          $scope.message = "Right eye info DISAGREED";
        }
        else{
          $scope.message = "Please try again later!";
        }
      })
     //checking selected value and calling api
     if($scope.param =="Left")
       $http.get('/api/disagreement', { params: { id : $scope.Patient_ID , item : $scope.param } }).success(function(res){
        if(res.n == "1"){
          $scope.message = "Left eye info DISAGREED!";
        }
        else{
          $scope.message = "Please try again later!";
        }
      })
   };

 $scope.pdf = function() {
      //setting message value null
      $scope.message = null;

    };
 });