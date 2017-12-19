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
            assesment_name:{
                  type : String
            },
            marks : {
                  type : String
            },
            recommendations : [
                  { 
                        question : {type : String},
                        response : {type : String},
                        error_lesson_title : {type : String},
                        _id : false
                  }
            ] 
});

resultSchema.index({ standard: 1, section: 1, subject: 1 , student_id : 1 , assesment_name : 1}, { unique: true });
// var Test = db.mode("Test", testSchema );

var Result = mongoose.model('Result', resultSchema);  
module.exports = Result;


