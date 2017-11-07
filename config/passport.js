//logic for user authentication, passport strategy used
var LocalStrategy = require('passport-local').Strategy;
// var Auth = require('../models/user');
var Teacher= require('../models/teacher');
var Student= require('../models/student');
var Parent= require('../models/parent');
module.exports = function(passport){
    passport.serializeUser(function(req, user, done) {
        // console.log("serial reqbody "+req);
        console.log("serial  " + user.id);
        console.log("serial  " + user);
        done(null, user);
    });

    passport.deserializeUser(function(req , user, done) {
        console.log("deserial req body "+user._id);
        console.log("deserial  role" + user.role);
        console.log("deserial  " + user.username);
        
        if(user.role == "teacher"){
        Teacher.findById(user._id, function(err, user) {
            done(err, user);
        });
    }
    if(user.role == "student"){
        Student.findById(user._id, function(err, user) {
            done(err, user);
        });
    }
    if(user.role == "parent"){
        Parent.findById(user._id, function(err, user) {
            done(err, user);
        });
    }

    });


    passport.use('login',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username, password, done) {
       console.log(req.body.role);
		if(req.body.role=="teacher"){
        Teacher.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('loginMessage','Incorrect username.' ));
            }
            if (!user.validPassword(password)) {
                return done(null, false,  req.flash('loginMessage','Incorrect password !' ));
            }
            return done(null, user);
        });
    }



        if(req.body.role=="parent"){
        Parent.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('loginMessage','Incorrect username.' ));
            }
            if (!user.validPassword(password)) {
                return done(null, false,  req.flash('loginMessage','Incorrect password !' ));
            }
            return done(null, user);
        });
    }


        if(req.body.role=="student"){
        Student.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('loginMessage','Incorrect username.' ));
            }
            if (!user.validPassword(password)) {
                return done(null, false,  req.flash('loginMessage','Incorrect password !' ));
            }
            return done(null, user);
        });
    }
    

     }
    ));



passport.use('teacherRegister',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username, password,done) {
        Teacher.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{

                    
                var newUser = new Teacher();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.qualification = req.body.qualification;
                newUser.job_description = req.body.job_description;
		        newUser.teaching_experience = req.body.teaching_experience;
                newUser.email_id = req.body.email_id;
                newUser.contact_number = req.body.contact_number;
                newUser.address = req.body.address;
                newUser.aadhar_no = req.body.aadhar_no;
                newUser.role = "teacher";
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null,newUser);
                });
            }
        });
    }));


passport.use('studentRegister',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username, password,done) {
        console.log(req.body.grade);
        console.log(req.body.fav_subject);
	console.log(req.body.email);
        console.log(req.body.contact);
	console.log(req.body.school);
	console.log(req.body.aadhar);
        console.log(req.body.teacherID.replace('string:',''));
        Student.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Student();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.email = req.body.email;
                newUser.grade = req.body.grade;
                newUser.contact = req.body.contact;
                newUser.address = req.body.address;
                newUser.aadhar = req.body.aadhar;
                newUser.school = req.body.school;
                newUser.fav_subject = req.body.fav_subject;
                newUser.role = "student";
                newUser.teacher_id = req.body.teacherID.replace('string:','');
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null,newUser);
                });
            }
        });
    }));


   passport.use('parentRegister',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username,password,done)  {
        console.log(req.body.qualification);
        console.log(req.body.job_description);
        console.log(req.body.email);
        console.log(req.body.aadhar);
        console.log(req.body.studentID.replace('string:',''));
        Parent.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Parent();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.email = req.body.email;
                newUser.qualification = req.body.qualification;
                newUser.job_description = req.body.job_description;
                newUser.contact = req.body.contact;
                newUser.aadhar = req.body.aadhar;
                newUser.address = req.body.address;
                newUser.role = "parent";
                newUser.student_id = req.body.studentID.replace('string:','');
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null,newUser);
                });
            }
        });
    }));
};