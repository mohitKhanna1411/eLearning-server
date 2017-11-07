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
                        question : {type : String},
                        option1 : {type : String},
                        option2 : {type : String},
                        option3 : {type : String},
                        option4 : {type : String},
                        right_answer : {type : String},
                        lesson_id: {type : String}


                  }
            ] 
});

classSchema.index({ standard: 1, section: 1, subject: 1}, { unique: true });
// var Test = db.mode("Test", testSchema );

var Class = mongoose.model('Class', classSchema);  
module.exports = Class;


