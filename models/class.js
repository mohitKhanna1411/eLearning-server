//var fs = require('fs');
var mongoose = require('mongoose');  

var classSchema = new mongoose.Schema({
            Teacher_ID:{ 
                  type: String,
                  unique : true
            },
            Standard:{ 
                  type: String
            },
            Section:{ 
                  type: String
            },
            Subject:{ 
                  type: String
            },
            
            Students:[
                  {
                        Student_ID : {type : String}
                  }
            ],
            Lessons : [
                  {
                        Content : {type : String},
                        Ref_Link : {type : String}
                  }
            ] 
});

var Class = mongoose.model('Class', classSchema);  
module.exports = Class;


