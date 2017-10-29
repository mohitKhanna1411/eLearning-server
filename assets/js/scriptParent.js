// creating the module
  var myApp = angular.module('myApp', ['ngRoute']);
// configuring routes
  myApp.config(function($routeProvider, $locationProvider){
    $routeProvider
    .when('/reportParent', {
      templateUrl : '/views/reportParent.html',
      controller  : 'controllerTeacher'
    })
    .when('/recommendationParent', {
      templateUrl : '/views/recommendationParent.html',
      controller  : 'controllerRecommendation'
    });
    $locationProvider.html5Mode(true);
  });

// creating mainController
  myApp.controller('controllerParent', function($scope, $http) {
    $scope.assesmentparent= function()
	{
		var type=$scope.type;
		//var data={"class":standard, "section":section, "subject":subject};
                //console.log(data);
		var config = {
                headers : 
			{
		            'Content-Type': 'application/json;'
		        }
            	}

            $http.post('/api/parent/assess', type, config)
            .success(function (data, status, headers, config) {
                $scope.ServerResponse = data;
		
		 $window.location.href = $scope.ServerResponse.redirect;
		
		
            })
            .error(function (data, status, header, config) {
                $scope.ServerResponse = "Data: " + data +
                    "<hr />status: " + status +
                    "<hr />headers: " + header +
                    "<hr />config: " + config;
			
			document.getElementById("message").innerHTML="Error";
			
            });

		
	}
    
  });
