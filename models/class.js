//var fs = require('fs');
var mongoose = require('mongoose');  

var classSchema = mongoose.Schema({
      standard:{ 
            type: String
      },
      section:{ 
            type: String
      },
      subject:{ 
            type: String
      },
      
      students:[{
            _id : false,
            Student_ID : {type : String }
            
      }],
      lessons : [{
            _id : false,
            Title :  {type : String},
            Content : {type : String},
            Ref_Link : {type : String},
            Ref_Video : {type : String}
      }],
      error_codes: [{
            _id : false,
            error_code : {type : String},
            lesson_title : {type : String}
      }],
      assesments :[{
            _id : false,
            assesment_name : {type : String},
            lesson_title : {type : String},
            assesment : [{
                        _id : false,
                        question : {type : String},
                        options : [{
                              _id : false,
                              answerText : {type : String},
                              correct : {type : Boolean},
                              error_lesson_title : {type : String}
                        }]
                  }]
      }]
                   
});

classSchema.index({ standard: 1, section: 1, subject: 1}, { unique: true });
// var Test = db.mode("Test", testSchema );

var Class = mongoose.model('Class', classSchema);  
module.exports = Class;


