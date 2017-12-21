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
            remedial_lessons :[{ 
                       _id : false,
                        remedial_lesson_title: {type : String,unique :true},
                        students : [{
                              student_ids : {type : String},
                              _id : false


                        }]
                  }]
            
});

recommendSchema.index({ standard: 1, section: 1, subject: 1 }, { unique: true });
// var Test = db.mode("Test", testSchema );

var Recommend = mongoose.model('Recommend', recommendSchema);  
module.exports = Recommend;

var newrec = new Recommend();
// newrec.standard = "1";
// newrec.section ="A";
// newrec.subject ="maths";

var arr=[];
for(var i=5;i<10;i++){
var obj={
      student_ids : "Stu-"+i
}      
arr.push(obj);
}

var rm={
      remedial_lesson_title : "assess8",
      students : arr
};


// newrec.save(function(err,savedObject){
//         if(err){
//               console.log(err);
//         }
//         else{
//               console.log(savedObject);
//        }
//  });

Recommend.update( { $and: [
      { standard : "1" }, 
      { section: "A"},
      { subject: "maths" }
      ]},{$addToSet : { remedial_lessons : rm } },function(request,docs){
            console.log(docs);
      });


