//var fs = require('fs');
var mongoose = require('mongoose');  

var resultSchema = mongoose.Schema({
            standard:{ 
                  type: String
            },
            section:{ 
                  type: String
            },
            subject:{ 
                  type: String
            },
            student_id:{
                  type : String
            },
            marks : {
                  type : String
            },
            recommendations : [
                  {
                        lesson_id : {type : String},
                        error_code : {type : String},
                        _id : false
                  }
            ] 
});

resultSchema.index({ standard: 1, section: 1, subject: 1 , student_id : 1 }, { unique: true });
// var Test = db.mode("Test", testSchema );

var Result = mongoose.model('Result', resultSchema);  
module.exports = Result;


