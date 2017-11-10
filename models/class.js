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
            
            students:[
                  {
                        Student_ID : {type : String },
                        _id : false
                  }
            ],
            lessons : [
                  {
                        Content : {type : String},
                        Ref_Link : {type : String}
                  }
            ] ,
            assesment : [
                  {
                        _id : false,
                        lesson_id: {type : String},
                        question : {type : String},
                        options : [{
                              answerText : {type : String},
                              correct : {type : Boolean},
                              error_code : {type : String},
                              _id : false
                        }]

                  }
            ] 
});

classSchema.index({ standard: 1, section: 1, subject: 1}, { unique: true });
// var Test = db.mode("Test", testSchema );

var Class = mongoose.model('Class', classSchema);  
module.exports = Class;


