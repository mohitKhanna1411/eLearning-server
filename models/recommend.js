var mongoose = require('mongoose');  

var recommendSchema = mongoose.Schema({
            standard:{ 
                  type: String
            },
            section:{ 
                  type: String
            },
            subject:{ 
                  type: String
            },
            assesment_name:{ 
                  type: String
            },
            lessons :[ 
                  { 
                        lesson_title: {type : String},
                        _id : false
                  }]
            
});

recommendSchema.index({ standard: 1, section: 1, subject: 1 }, { unique: true });
// var Test = db.mode("Test", testSchema );

var Recommend = mongoose.model('Recommend', recommendSchema);  
module.exports = Recommend;