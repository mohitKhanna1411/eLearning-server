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
            Ref_Video : {type : String},
            Ref_Upload_File : {type : String},
            _id : false
      }
      ] ,
      remedial_lessons : [
      {
            remedial_title :  {type : String},
            remedial_content : {type : String},
            remedial_ref_link : {type : String},
            remedial_ref_video : {type : String},
            remedial_ref_upload_file : {type : String},
            _id : false
      }
      ] ,
      error_codes: [
      {
            error_code : {type : String},
            remedial_title : {type : String},
            _id : false
      }
      ] ,
      assesments : [{
            _id : false,
            assesment_name : {type : String},
            lesson_title : {type : String},
            questions : [{
                        _id : false,
                        questionText : {type : String},
                        options : [{
                              answerText : {type : String},
                              correct : {type : Boolean},
                              error_code : {type : String},
                              _id : false
                        }]//options
                  }]//questions
      }]//assesments
});

classSchema.index({ standard: 1, section: 1, subject: 1}, { unique: true });
// var Test = db.mode("Test", testSchema );

var Class = mongoose.model('Class', classSchema);  
module.exports = Class;


