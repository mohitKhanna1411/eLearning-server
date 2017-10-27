//var fs = require('fs');
var mongoose = require('mongoose');  

var User = new mongoose.Schema({
            Patient_ID:{ 
                  type: String,
                  unique: true
            },
            Patient_Name:{ 
                  type: String,
            },
            Patient_Age:{ 
                  type: String,
            },
            Patient_Diabetic:{ 
                  type: String,
            },
            Patient_Eye:{ 
                  type: String,
            },
            Patient_Hardware:{ 
                  type: String,
            },
            Patient_Date:{ 
                  type: String,
            },
            Patient_Analyzed:{ 
                  type: String,
            },
            Patient_Image_Raw_Right:{ 
                  type: String, 
            },
            Patient_Image_Analyzed_Right:{ 
                  type: String, 
            },
            Patient_Image_Raw_Left:{ 
                  type: String, 
            },
            Patient_Image_Analyzed_Left:{ 
                  type: String, 
            },
            Patient_Yellow_Lesion_Right:{ 
                  type: String,
            },
            Patient_Red_Lesion_Right:{ 
                  type: String,
            },
            Patient_Yellow_Lesion_Left:{ 
                  type: String,
            },
            Patient_Red_Lesion_Left:{ 
                  type: String,
            },
            Patient_Diagnosis:{ 
                  type: String,
            },
            Patient_Referral:{ 
                  type: String,
            },
            Agreement_Right:{ 
                  type: Boolean,
            },
            Agreement_Left:{ 
                  type: Boolean,
            }
});

var myModel = mongoose.model('User', User);  
module.exports = myModel;


// var imgPath1 = './examples/upload/1000130/10030a.jpeg';
// var imgPath2 = './examples/upload/1000130/10030b.png';
// var imgPath3 = './examples/upload/1000130/10030a (copy).jpeg';
// var imgPath4 = './examples/upload/1000130/10030b (copy).png';

// var newModel = new myModel();
//   newModel.Patient_ID = '1000130';
//   newModel.Patient_Name = 'Name'+10;
//   newModel.Patient_Age = 'Age'+10;
//   newModel.Patient_Diabetic = 'Diabetic'+10;
//   newModel.Patient_Eye = 'Eye'+10;
//   newModel.Patient_Hardware = 'Hardware'+10;
//   newModel.Patient_Date = 'Date'+10;
//   newModel.Patient_Analyzed = 'Analyzed'+10;
//   newModel.Patient_Yellow_Lesion_Right  = 'yellowRight'+10;
//   newModel.Patient_Red_Lesion_Right  = 'redRight'+10;
//   newModel.Patient_Yellow_Lesion_Left  = 'yellowLeft'+10;
//   newModel.Patient_Red_Lesion_Left  = 'redLeft'+10;
//   newModel.Patient_Diagnosis  = 'Diagnosis'+10;
//   newModel.Patient_Referral  = 'Referral'+10;
//   newModel.Patient_Image_Raw_Right = imgPath1;
//   newModel.Patient_Image_Analyzed_Right = imgPath2;
//   newModel.Patient_Image_Raw_Left = imgPath3;
//   newModel.Patient_Image_Analyzed_Left = imgPath4;


// newModel.save(function(err,savedObject){
//        if(err){
//              console.log(err);
//        }
//        else{
//              console.log(savedObject);
//       }
// });
//mongoose.connect('mongodb://rito:41192b542a@aws-ap-southeast-1-portal.1.dblayer.com:16217/advenio-demo?ssl=true'); 

console.log('we are connected');
