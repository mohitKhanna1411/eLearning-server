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
mongoose.Promise = global.Promise;
mongoose.connect(config.db,{
	useMongoClient : true
});

require('./config/passport')(passport);
// var User = require('./config/db');
var Auth = require('./models/user');
var Teacher= require('./models/teacher');
var Student= require('./models/student');
var Parent= require('./models/parent');
var Class = require('./models/class');
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
	Teacher.find( {},{_id: 1 } ,function(request,docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	});
});

app.get('/api/listStudentIDs', function(req,res,next){
	console.log("inside list t_ID");
	Student.find( {},{_id: 1 } ,function(request,docs){
		console.log(docs);
		res.send(JSON.stringify(docs));
	});
});

app.post('/api/teacher/manageGrade', function(req,res,next){
	console.log(req.body);
	// console.log(Class);

 var newModel = new Class();
 newModel.standard = req.body.class;
 newModel.section = req.body.section;
 newModel.subject = req.body.subject;

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
});

app.post('/api/teacher/addStudent', function(req,res,next){
	console.log(req.body);
	var stu_id = { Student_ID: req.body.student };
	console.log(stu_id);
	// console.log(Class);
// Class.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );

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





app.post('/api/teacher/addlessons', function(req,res,next){
	console.log(req.body);
	var data = { Content: req.body.content,Ref_Link: req.body.ref_link };
	console.log(data);
	// console.log(Class);
// Class.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );

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
			res.end("Lesson successfully added.");
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
			res.end("Student Already deleted in this class.");
		}
		else if(docs.n == 1 && docs.nModified == 1 && docs.ok == 1){
			res.end("Student successfully deleted.");
		}
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

app.get('/api/getlessons', function(req,res,next){
	console.log("req   "+req.query.class);
	console.log("req   "+req.query.subject);
	console.log("req   "+req.query.section);
	
Class.find( { $and: [
    { standard : req.query.class }, 
    { section: req.query.section },
    { subject: req.query.subject }
  ]},{ lessons : 1, _id: 0 },function(request,docs){
		console.log(docs.length);
		if(docs.length == 0){
			res.end(JSON.stringify(docs.length));
		}
		else{
			res.end(JSON.stringify(docs[0].lessons));
		} 
		
	});
 
});

app.listen(port,function()
{
	console.log('Server started on port '+port+' !');
});

