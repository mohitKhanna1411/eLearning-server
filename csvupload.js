var app = angular.module('myapp', []);

app.controller('MainCtrl', [
    '$scope',
    'readFileData',
    function($scope, readFileData) {
      $scope.fileDataObj = {};
    
    $scope.uploadFile = function() {
      if ($scope.fileContent) {
        $scope.fileDataObj = readFileData.processData($scope.fileContent);
      
        $scope.fileData = JSON.stringify($scope.fileDataObj);
      }
    }
 }]);
 
 app.directive('fileReaderDirective', function() {
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

app.factory('readFileData', function() {
    return {
        processData: function(csv_data) {
            var record = csv_data.split(/\r\n|\n/);
            var headers = record[0].split(',');
            var lines = [];
            var json = {};

            for (var i = 1; i < record.length; i++) {
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
            console.log(json);
            console.log(json[0][0].replace(/^"(.*)"$/, '$1'));
            return json;
            
            	
        }
    };
});



// var app = angular.module('myapp', []);

// app.controller('MainCtrl', function($scope) {
//   $scope.name = 'World';

// $scope.data = '';
//     $scope.toJSON = '';

//     $scope.uploadFile = function(){
//         console.log("Add called");
//         var csvFile = document.getElementById('file').files[0],
//             reader = new FileReader();
//         reader.onloadend = function(e){
//             var data = e.target.result;
//             console.log("File Name: ", document.getElementById('file').files[0].name);

//             $scope.data = e.target.result;

//             // Trying to convert to JSON object
//             $scope.toJSON = angular.toString($scope.data);
            
//          var lines = toJson.split('\n');
//          var headerValues = lines[0].split(',');
//           var dataValues = lines.splice(1).map(function (dataLine) { return dataLine.split(','); });
//             return dataValues.map(function (rowValues) {
//              var row = {};
//               headerValues.forEach(function (headerValue, index) {
//               row[headerValue] = (index < rowValues.length) ? rowValues[index] : null;
//         });
//         return row;
//     });





//             console.log("Json Data: ", $scope.toJSON);

//             // --> $http POST request with the JSON onject as input data
//         }

//        reader.readAsText(csvFile);
//     }




// });

