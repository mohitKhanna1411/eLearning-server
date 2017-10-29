//logic for user authentication, passport strategy used
var LocalStrategy = require('passport-local').Strategy;
var Auth = require('../models/user');
var Teacher= require('../models/teacher');
var Student= require('../models/student');
var Parent= require('../models/parent');
module.exports = function(passport){
    passport.serializeUser(function(req, user, done) {
        // console.log("serial req body "+req);
        // console.log("serial  " + user.id);
        // console.log("serial  " + user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Auth.findById(id, function(err, user) {
            done(err, user);
        });
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
	console.log(req.body.qualification);
        console.log(req.body.job_description);
	console.log(req.body.teaching_experience);
        console.log(req.body.grade);
        console.log(req.body.fav_subject);
        Teacher.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Teacher();
                newUser.username = username;

               newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.qualification = req.body.qualification;
                newUser.job_description = req.body.job_description;
		newUser.teaching_experience = req.body.teaching_experience;
                newUser.grade = req.body.grade;
                newUser.fav_subject = req.body.fav_subject;
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
       console.log(req.body.qualification);
        console.log(req.body.job_description);
        console.log(req.body.grade);
        console.log(req.body.fav_subject);
        console.log(req.body.teacherID.replace('string:',''));
        Student.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Student();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.qualification = req.body.qualification;
                newUser.job_description = req.body.job_description;
                newUser.grade = req.body.grade;
                newUser.fav_subject = req.body.fav_subject;
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
        console.log(req.body.grade);
        console.log(req.body.fav_subject);
        console.log(req.body.studentID.replace('string:',''));
        Parent.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Parent();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.qualification = req.body.qualification;
                newUser.job_description = req.body.job_description;
                newUser.grade = req.body.grade;
                newUser.fav_subject = req.body.fav_subject;
                newUser.student_id = req.body.studentID.replace('string:','');
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null,newUser);
                });
            }
        });
    }));  




};
