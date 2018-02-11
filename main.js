// importing modules 
var express = require('express'),
app = express();
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var config = require('./config/database');
var port = process.env.PORT || 8080;
var multer	=	require('multer');
var json2csv = require('json2csv');
mongoose.Promise = global.Promise;
mongoose.connect(config.db,{
	useMongoClient : true
});

require('./config/passport')(passport);
// var User = require('./config/db');
var Teacher= require('./models/teacher');
var Student= require('./models/student');
var Parent= require('./models/parent');
var Class = require('./models/class');
var Result = require('./models/result');

var Recommend = require('./models/recommend');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
	app.use(express.static(path.join(__dirname)));
	res.render(path.join(__dirname,'/index.ejs'));
});

//initial route
// app.get('/', function(req, res){
// 	var express=require('express');
// 	app.use(express.static(path.join(__dirname)));
// 	res.sendFile(path.join(__dirname,'views/login.ejs'));

// });

//passport initalization for user authentication
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
	secret:'secret123',
	saveUninitialized: true,
	resave:true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine','ejs');
require('./routes/routes')(app, passport);

app.get('/api/listTeacherIDs', function(req,res,next){
	console.log("inside list t_ID");
	Teacher.find( {}, { teacher_id : 1} , function(request,docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/listStudentIDs', function(req,res,next){
	console.log("inside list s_ID");
	Student.find({},{ student_id : 1},function(request,docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	});
});


app.get('/api/listParentIDs', function(req,res,next){
	console.log("inside list p_ID");
	Parent.find( {},{parent_id : 1} ,function(request,docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	});
});



app.post('/api/teacher/manageGrade', function(req,res,next){
	console.log(req.body);
	// console.log(Class);

	var newModel = new Class();

	var newRec=new Recommend();
	newModel.standard = req.body.class;
	newModel.section = req.body.section;
	newModel.subject = req.body.subject;
	newRec.standard = req.body.class;
	newRec.section = req.body.section;
	newRec.subject = req.body.subject;


	newModel.save(function(err,savedObject){
		if(err){
			console.log(err);
			if(err.code == 11000)
				res.end("Class already exists.")
		}
		else{
			console.log(savedObject);
			res.end("Class : "+savedObject.standard+"-"+savedObject.section+"-"+savedObject.subject+"  successfully created.")
		}
	});


	newRec.save(function(err,savedObject){
		if(err){
			console.log(err);
			if(err.code == 11000){
				
			}
			res.end("Error : " + err.code);
		}
		else{
			console.log(savedObject);
			
		}
	});

});

app.post('/api/teacher/addStudent', function(req,res,next){
	console.log(req.body);
	var stu_id = { Student_ID: req.body.student };
	console.log(stu_id);


	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { students : stu_id } },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Class combination does not exist! Please add Student into a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Student Already added in this class.");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Student successfully added.");
			}
		});
	
});


app.post('/api/admin/addAssesment', function(req,res){

	console.log(req.body.dataObj);


	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { assesments : req.body.dataObj } },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Class combination does not exist! Please add Assesment into a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Duplicate Assesment!!!");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Assesment successfully added.");
			}
		});

	
});


app.post('/api/addResults', function(req,res,next){

	console.log(req.body);

	var newRes = new Result();

	// var newRec=new Recommend();

	newRes.standard = req.body.class;
	newRes.section = req.body.section;
	newRes.subject = req.body.subject;
	newRes.student_id = req.user.student_id;
	newRes.assesment_name=req.body.assesment;
	newRes.marks = req.body.count;
	newRes.recommendations = req.body.recommendations;
	newRes.save(function(err,savedObject){
		if(err){
			console.log(err);
			if(err.code == 11000){
				res.end("This assesment is avaiable for practice only because you have already taken this Test.")
				console.log(res);
				console.log("This assesment is avaiable for practice only because you have already taken this Test.");
			}
			res.end("Error : " + err.code);
		}
		else{
			console.log(savedObject);
			res.end("Test Results Saved successfully!");
		}
	});



	Recommend.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { remedial_lessons: req.body.remedial_lessons } },function(request,docs,err){
			console.log(docs);
			if(err){
				console.log(err);
				res.end("Error : " + err);
			}
			else{
				console.log("saved");
			}
		});


	
});
var storage	=	multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './uploads');
	},
	filename: function (req, file, callback) {
		console.log("filename========");
		console.log(file);
		callback(null, 'ourPortal-' + file.originalname.replace(/\..+$/, '') + '-' + Date.now() + path.extname(file.originalname));
	}
});

var upload = multer({ storage : storage }).fields([{
           name: 'file', maxCount: 1
         }, {
           name: 'file2', maxCount: 1
         }]);

app.post('/api/teacher/addlessons', function(req,res,next){
	upload(req,res,function(err) {
		console.log("post==============")
		console.log(req.body);
		console.log(req.files);
		if(req.files.file){
			console.log("here=======");
			console.log(req.files.file);
			var filePath = "./" + req.files.file[0].path;
		}else{
			var filePath = "";
		}
		if(req.files.file2){
			console.log("file2 here========");
			var file2Path = "./" + req.files.file2[0].path;
		}else{
			var file2Path = "";
		}
	// console.log(req.file.path);
	var data = { Title:req.body.title,Content: req.body.content, Ref_Link: req.body.ref_link, 
		Ref_Video : filePath , Ref_Upload_File : file2Path};


	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { lessons : data } },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Class combination does not exist! Please add lesson into a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Lesson Already added in this class.");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Lesson successfully added. You can add more lessons!");
			}
		});
});
});

app.post('/api/admin/addRemedialLessons', function(req,res,next){
	upload(req,res,function(err) {
		console.log("post====")
		console.log(req.body);
		console.log(req.files);
		if(req.files.file){
			console.log("here=======");
			console.log(req.files.file);
			var filePath = "./" + req.files.file[0].path;
		}else{
			var filePath = "";
		}
		if(req.files.file2){
			console.log("file2 here========");
			var file2Path = "./" + req.files.file2[0].path;
		}else{
			var file2Path = "";
		}
	// console.log(req.file.path);
	var data = { 	remedial_title : req.body.title,
		remedial_content : req.body.content,
		remedial_ref_link : req.body.ref_link,
		remedial_ref_video : filePath,
		remedial_ref_upload_file : file2Path 
	};

	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { remedial_lessons : data } },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Class combination does not exist! Please add remedial lesson into a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Remedial Lesson Already added in this class.");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Remedial Lesson successfully added. You can add more lessons!");
			}
		});
});
});

app.post('/api/admin/addErrorCodes', function(req,res,next){
	console.log(req.body);


	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]},{$addToSet : { error_codes : { $each : req.body.error_codes } } },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Combination does not exist! Please add error codes into a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Error Codes Already added in this class.");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Error Codes successfully added. You can add more Error Codes!");
			}
		});

});




app.post('/api/teacher/deleteStudent', function(req,res,next){
	console.log(req.body);
	var stu_id = req.body.student ;
	console.log(stu_id);

	Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject }
		]}, { "$pull": { students: { Student_ID : stu_id } }}, { safe: true, multi:true },function(request,docs){
			console.log(docs);
			if(docs.n == 0 && docs.nModified == 0){
				res.end("Class combination does not exist! Please delete Student from a valid class");
			}
			else if(docs.n == 1 && docs.nModified == 0){
				res.end("Student Does not exist in this class");
			}
			else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Student successfully deleted.");
			}
		});
	
});

app.get('/api/getReport', function(req,res,next){
	 // console.log("inside g et username    :"  + req.user.username);

	 Parent.find({username : req.user.username},{ student_id: 1},function(request,docs){
	 	console.log("id  :  " + docs)
	 	Result.find({ student_id: docs[0].student_id }, function(request,docu){
	 		console.log("docu :  "+  docu);
	 		res.end(JSON.stringify(docu));

	 	});
	 });

	});


app.get('/api/getClasses', function(req,res,next){
	console.log("inside get");
	Class.find( {},function(request,docs){
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/getStudents', function(req,res,next){
	console.log("inside get");
	Student.find( {},function(request,docs){
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/getParents', function(req,res,next){
	console.log("inside get");
	Parent.find( {},function(request,docs){
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/getTeachers', function(req,res,next){
	console.log("inside get");
	Teacher.find( {},function(request,docs){
		res.send(JSON.stringify(docs));
	});
});



app.get('/api/getErrorCodes', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		] },{ error_codes : 1, _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				console.log("error_codes else : "+ docs);
				res.end(JSON.stringify(docs[0].error_codes));
			} 
			
		});
	
});


app.get('/api/getOverallRecommend', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Recommend.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		] },{ remedial_lessons : 1, _id: 0 },function(request,docs){
			console.log(docs);
			// res.end(JSON.stringify(docs[0].remedial_lessons));
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				console.log("getOverallRecommend else : "+ docs);
				res.end(JSON.stringify(docs[0].remedial_lessons));
			} 
			
		});
	
});






















app.get('/api/student/getlessons', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		],students : {$elemMatch : { Student_ID : req.user.student_id } }
	},{ lessons : 1, _id: 0 },function(request,docs){
		console.log(docs);
		if(docs.length == 0){
			res.end(JSON.stringify(docs.length));
		}
		else{
			console.log("lessons else : "+ docs);
			res.end(JSON.stringify(docs[0].lessons));
		} 

	});
	
});


app.get('/api/admin/getlessons', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		]},{ lessons : 1, _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				console.log("lessons else : "+ docs[0].lessons);
				res.end(JSON.stringify(docs[0].lessons));
			} 
			
		});
	
});

app.post('/api/admin/deleteLesson', function(req,res,next){
	console.log("req   "+req.body.class);
	console.log("req   "+req.body.subject);
	console.log("req   "+req.body.section);
	
		Class.update( { $and: [
		{ standard : req.body.class }, 
		{ section: req.body.section },
		{ subject: req.body.subject } ] },
		{ "$pull": { lessons: { Title : req.body.title_lesson } }}, { safe: true, multi:true },
		function(request,docs){
			console.log(docs);
			if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
				res.end("Lesson successfully deleted.");
			}else{
				res.end("Some Internal Error. Plase try again!");
			}
		});
	
});


app.get('/api/teacher/getlessons', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		]},{ lessons : 1, _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				console.log("lessons else : "+ docs);
				res.end(JSON.stringify(docs[0].lessons));
			} 		
		});
});

app.get('/api/admin/getremedialLessons', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		]},{ remedial_lessons : 1, _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				console.log("remedial_lessons else : "+ docs);
				res.end(JSON.stringify(docs[0].remedial_lessons));
			} 
			
		});
	
});

app.get('/api/getClassStudents', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		]},{ students : 1, _id: 0 },function(request,docs){
			// console.log(docs[0].students);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				res.end(JSON.stringify(docs[0].students));
			} 
			
		});
	
});


app.get('/api/getAllAssign', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		],students : { $elemMatch : { Student_ID : req.user.student_id } }
	},{ assesments : 1, _id: 0 },function(request,docs){
		console.log(docs);
		if(docs.length == 0){
			res.end(JSON.stringify(docs.length));
		}
		else{
			res.end(JSON.stringify(docs[0].assesments));
		} 
		
	});
	
});



app.get('/api/teacher/getAllAssign', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Class.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject }
		],students : { $elemMatch : { Student_ID : req.query.student } }
	},{ assesments : 1, _id: 0 },function(request,docs){
		console.log(docs);
		if(docs.length == 0){
			res.end(JSON.stringify(docs.length));
		}
		else{
			res.end(JSON.stringify(docs[0].assesments));
		} 
		
	});
	
});


app.get('/api/getRemedialTitle', function(req,res,next){
	// req.query.error_code="E001";
	// console.log("error code   "+req.query.error_code);

	
	
	Class.find( {error_codes : {$elemMatch: {error_code: req.query.error_code}}},
		{ error_codes : {$elemMatch: {error_code: req.query.error_code}} },
		function(request,docs){
			res.end(JSON.stringify(docs[0].error_codes[0]));
		});
	
}); 


app.get('/api/getAssign', function(req,res,next){
	// req.query.assesment_name = "assesment2";
	console.log("req   "+req.query.assesment_name);
	
	Class.findOne( {assesments : {$elemMatch: {assesment_name: req.query.assesment_name}}},
		{assesments: {$elemMatch: {assesment_name: req.query.assesment_name}}},
		function(request,docs){
			res.end(JSON.stringify(docs.assesments[0]));

		});
	
}); 



app.get('/api/student/getSpecificLesson', function(req,res,next){
	// req.query.assesment_name = "assesment2";
	console.log("req   "+ req.query.Title);
	Student.update({ username : req.user.username },{$set : { last_lesson : req.query.Title }}, function(request,docs){

		console.log(docs);

	})

	Class.findOne( {lessons : {$elemMatch: {Title: req.query.Title}}},
		{lessons: {$elemMatch: {Title: req.query.Title}}},
		function(request,docs){
			console.log("inside find specific lesson");
			console.log(docs);
			res.end(JSON.stringify(docs.lessons[0]));

		});
	
}); 

app.get('/api/teacher/getSpecificLesson', function(req,res,next){
	// req.query.assesment_name = "assesment2";
	console.log("req   "+ req.query.Title);
	Teacher.update({ username : req.user.username },{$set : { last_lesson : req.query.Title }}, function(request,docs){

		console.log(docs);

	})

	Class.findOne( {lessons : {$elemMatch: {Title: req.query.Title}}},
		{lessons: {$elemMatch: {Title: req.query.Title}}},
		function(request,docs){
			console.log("inside find specific lesson");
			console.log(docs);
			res.end(JSON.stringify(docs.lessons[0]));

		});
	
}); 


app.get('/api/student/getLastLesson', function(req,res,next){
	// req.query.assesment_name = "assesment2";
	Student.find({ username : req.user.username },{ last_lesson : 1}, function(request,docs){

		console.log("docsssssssss get lesson" + docs);
		
		res.end(JSON.stringify(docs[0]));
	})
});


app.get('/api/teacher/getLastLesson', function(req,res,next){
	// req.query.assesment_name = "assesment2";
	Teacher.find({ username : req.user.username },{ last_lesson : 1 }, function(request,docs){

		console.log("docsssssssss get lesson" + docs);
		
		res.end(JSON.stringify(docs[0]));
	})
});



app.get('/api/getRes', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Result.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject },
		{assesment_name : req.query.assesment_name}
		,{ student_id: req.user.student_id }

		]},{ recommendations : 1, marks: 1 , _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				res.end(JSON.stringify(docs[0]));
			} 
			
		});
	
});



app.get('/api/teacher/getRes', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
	Result.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject },
		{assesment_name : req.query.assesment_name}
		,{ student_id: req.query.student }

		]},{ recommendations : 1, marks: 1 , _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				res.end(JSON.stringify(docs[0]));
			} 
			
		});
	
});


app.get('/api/parent/getRecomm', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	

	Parent.find({username : req.user.username},{ student_id: 1},function(request,docs){
		console.log("docs====");
		console.log(docs);
		Result.find( { $and: [
			{ standard : req.query.class }, 
			{ section: req.query.section },
			{ subject: req.query.subject },
			{ assesment_name: req.query.assesment_name },
			{ student_id: docs[0].student_id }
			]},{ recommendations : 1 },function(request,docu){
				console.log("docu===");
				console.log(docu);
				
				res.end(JSON.stringify(docu[0].recommendations));

				
			});
	});
});

app.get('/api/teacher/getRes', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	console.log("req   "+req.query.student_id);
	
	Result.find( { $and: [
		{ standard : req.query.class }, 
		{ section: req.query.section },
		{ subject: req.query.subject },
		{ assesment_name: req.query.assesment_name },
		{ student_id: req.query.student_id }
		]},{ recommendations : 1, marks: 1 , _id: 0 },function(request,docs){
			console.log(docs);
			if(docs.length == 0){
				res.end(JSON.stringify(docs.length));
			}
			else{
				res.end(JSON.stringify(docs[0]));
			} 
			
		});
	
});


app.get('/api/student/getCSV', function(req,res,next){

	Student.find({},function(request,docs){
		res.setHeader('Content-disposition', 'attachment; filename=StudentRecords.csv');
		res.set('Content-Type', 'text/csv');
      // console.log(docs);
      var fields = ['S.NO.', 'Username','Student ID', 'Email ID','Address', 'Teacher ID', 'School','Grade', 'Fav Subject', 'Aadhar Number', 'Contact Number'];
      var csvArr =[];
      for(var i=0;i<docs.length;i++){
      	csvArr.push(
      	{
      		"S.NO.": i+1,
      		"Username": docs[i].username,
      		"Student ID" : docs[i].student_id,
      		"Email ID": docs[i].email,
      		"Address": docs[i].address,
      		"Teacher ID": docs[i].teacher_id,
      		"School": docs[i].school,
      		"Grade": docs[i].grade,
      		"Fav Subject": docs[i].fav_subject,
      		"Aadhar Number": docs[i].aadhar,
      		"Contact Number": docs[i].contact
      	}
      	);
          }//for loop
          // console.log("created array  :  " + csvArr)

          var csvFile = json2csv({ data: csvArr, fields: fields });

          res.send(csvFile);

      }); 
});



app.get('/api/teacher/getCSV', function(req,res,next){

	Teacher.find({},function(request,docs){
		res.setHeader('Content-disposition', 'attachment; filename=TeacherRecords.csv');
		res.set('Content-Type', 'text/csv');
      // console.log(docs);
      var fields = ['S.NO.', 'Username', 'Teacher ID','Email ID', 'Address', 'Qualification','Job Description', 'Teaching Exp', 'Aadhar Number', 'Contact Number'];
      var csvArr =[];
      for(var i=0;i<docs.length;i++){
      	csvArr.push(
      	{
      		"S.NO.": i+1,
      		"Username": docs[i].username,
      		"Teacher ID": docs[i].teacher_id,
      		"Email ID": docs[i].email_id,
      		"Address": docs[i].address,
      		"Qualification": docs[i].qualification,
      		"Job Description": docs[i].job_description,
      		"Teaching Exp": docs[i].teaching_experience,
      		"Aadhar Number": docs[i].aadhar_no,
      		"Contact Number": docs[i].contact_number
      	}
      	);
          }//for loop
          // console.log("created array  :  " + csvArr)

          var csvFile = json2csv({ data: csvArr, fields: fields });

          res.send(csvFile);

      }); 
});





app.get('/api/parent/getCSV', function(req,res,next){

	Parent.find( {},function(request,docs){
		res.setHeader('Content-disposition', 'attachment; filename=ParentRecords.csv');
		res.set('Content-Type', 'text/csv');
      // console.log(docs);
      var fields = ['S.NO.', 'Username', 'Parent ID','Email ID', 'Address', 'Job Description','Qualification', 'Student ID', 'Aadhar Number', 'Contact Number'];
      var csvArr =[];
      for(var i=0;i<docs.length;i++){
      	csvArr.push(
      	{
      		"S.NO.": i+1,
      		"Username": docs[i].username,
      		"Parent ID": docs[i].parent_id,
      		"Email ID": docs[i].email,
      		"Address": docs[i].address,
      		"Job Description": docs[i].job_description,
      		"Qualification": docs[i].qualification,
      		"Student ID": docs[i].student_id,
      		"Aadhar Number": docs[i].aadhar,
      		"Contact Number": docs[i].contact
      	}
      	);
          }//for loop
          // console.log("created array  :  " + csvArr)

          var csvFile = json2csv({ data: csvArr, fields: fields });

          res.send(csvFile);

      }); 
});



app.get('/api/parent/getReportCSV', function(req,res,next){

	Parent.find({username : req.user.username},{ student_id: 1},function(request,docs){
	 	//console.log("id  :  " + docs[0].student_id)
	 	Result.find({ student_id: docs[0].student_id }, function(request,docu){
	 		res.setHeader('Content-disposition', 'attachment; filename=StudentReport.csv');
	 		res.set('Content-Type', 'text/csv');
      // console.log(docs);
      var fields = ['S.NO.', 'Class', 'Section','Subject', 'Assesment Name','Marks'];
      var csvArr =[];
      for(var i=0;i<docu.length;i++){
      	csvArr.push(
      	{
      		"S.NO.": i+1,
      		"Class": docu[i].standard,
      		"Section": docu[i].section,
      		"Subject": docu[i].subject,
      		"Assesment Name": docu[i].assesment_name,
      		"Marks": docu[i].marks,

      	}
      	);
          }//for loop
          // console.log("created array  :  " + csvArr)

          var csvFile = json2csv({ data: csvArr, fields: fields });

          res.send(csvFile);
      });

	 }); 
});





app.post('/api/admin/deleteStudent', function(req,res,next){
	console.log(req.body);
	var stu_id = req.body.student_id ;
	console.log(stu_id);
	Student.remove({ student_id: stu_id }, function(err) {
		if (!err) {

			res.end('Student Removed');
		}
		else {
			res.end('Student could not be removed. Please try again later!');

		}
	});
	
});

app.post('/api/admin/deleteTeacher', function(req,res,next){
	console.log(req.body);
	var tea_id = req.body.teacher_id ;
	console.log(tea_id);

	Teacher.remove( { teacher_id: tea_id }, function(err) {
		if (!err) {
			res.end('Teacher Removed');
		}
		else {
			res.end('Teacher could not be removed. Please try again later!');

		}
	});
	
});


app.post('/api/admin/deleteParent', function(req,res,next){
	console.log(req.body);
	var par_id = req.body.parent_id ;
	console.log(par_id);

	Parent.remove( { parent_id: par_id }, function(err) {
		if (!err) {
			res.end('Parent Removed');
		}
		else {
			res.end('Parent could not be removed. Please try again later!');

		}
	});
	
});








app.listen(port,function()
{
	console.log('Server started on port '+port+' !');
});

