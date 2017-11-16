//setting up routes
var express = require('express'),
app = express();
var passport = require("passport");
var path = require('path');
var async = require("async");
var flash = require('connect-flash');
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var Teacher= require('../models/teacher');
var Student= require('../models/student');
var Parent= require('../models/parent');
require('../config/passport')(passport);

module.exports = function(app,passport){

    app.get('/login', function(req, res){
        res.render('login.ejs',{message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('login',{

        failureRedirect : '/login',
        failureFlash : true
    }),(req,res)=>{

        // console.log(req.body);
        if (req.body.role=="teacher") {
          res.redirect('/dashboardTeacher');
      }
      else if (req.body.role=="parent") {
          res.redirect('/dashboardParent');
      }
      else if (req.body.role=="student") {
          res.redirect('dashboardStudent');
      }

  });

    app.get('/register', function(req, res){
    res.render('register.ejs');    
});

    app.get('/studentRegister', function(req, res){
    res.render('studentRegister.ejs',{message: req.flash('registerMessage')});    
});

    app.post('/studentRegister', passport.authenticate('studentRegister',{
        successRedirect : '/dashboardStudent',
        failureRedirect : '/register',
        failureFlash : true
    }));
    app.get('/teacherRegister', function(req, res){
    //res.json({message: req.flash('registerMessage')});
    res.render('teacherRegister.ejs',{message: req.flash('registerMessage')});    
});

    app.post('/teacherRegister', passport.authenticate('teacherRegister',{
        successRedirect : '/dashboardTeacher',
        failureRedirect : '/register',
        failureFlash : true
    }));


    app.get('/parentRegister', function(req, res){
    //res.json({message: req.flash('registerMessage')});
    res.render('parentRegister.ejs',{message: req.flash('registerMessage')});    
});

    app.post('/parentRegister', passport.authenticate('parentRegister',{
        successRedirect : '/dashboardParent',
        failureRedirect : '/register',
        failureFlash : true
    }));

    app.get('/dashboardTeacher',isLoggedIn, function(req, res){
        res.render('dashboardTeacher.ejs',{user : req.user}); 
    });

    app.get('/dashboardStudent',isLoggedIn, function(req, res){
        res.render('dashboardStudent.ejs',{user : req.user}); 
    });

    app.get('/dashboardParent',isLoggedIn, function(req, res){
        res.render('dashboardParent.ejs',{user : req.user}); 
    });

    app.get('/dashboardAdmin', function(req, res){
        res.render('dashboardAdmin.ejs',{user : req.user}); 
    });

    app.get('/logout', function(req,res){
        req.logout();
        console.log("logout success");
        res.redirect('/');
    });



// forgot password
app.get('/forgot', function(req, res) {
  res.render('forgot',{success : req.flash('success') , error : req.flash('error')});
});

app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
        console.log("role" + req.body.role);
        if(req.body.role == "student"){
      Student.findOne({ email: req.body.email }, function(err, user) {
        console.log("stu============");
        console.log(user);
        if (!user) {

          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
  }

   if(req.body.role == "teacher"){
      Teacher.findOne({ email_id: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
  }

   if(req.body.role == "parent"){
      Parent.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
  }

    },
    function(token, user, done) {

        if(user.role=="student"){

      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'sksmartysabhya@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/student/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
  }

  if(user.role=="teacher"){

      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email_id,
        from: 'sksmartysabhya@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/teacher/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email_id + ' with further instructions.');
        done(err, 'done');
      });
  }


  if(user.role=="parent"){

      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'sksmartysabhya@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/parent/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
  }

    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

app.get('/reset/student/:token', function(req, res) {
    console.log(req.user);
  Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('resetStudent.ejs', {token: req.params.token , success : req.flash('success') , error : req.flash('error')});
  });
});

app.get('/reset/teacher/:token', function(req, res) {
    console.log(req.user);
  Teacher.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('resetTeacher.ejs', {token: req.params.token , success : req.flash('success') , error : req.flash('error')});
  });
});

app.get('/reset/parent/:token', function(req, res) {
    console.log(req.user);
  Parent.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('resetParent.ejs', {token: req.params.token , success : req.flash('success') , error : req.flash('error')});
  });
});

app.post('/reset/teacher/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Teacher.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'sksmartysabhya@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email_id + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/dashboardTeacher');
  });
});


app.post('/reset/student/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Student.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log("stu----");
        console.log(user);
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
                console.log("save========");
                console.log(err);
              req.logIn(user, function(err) {
                console.log("logIn=======")
                console.log(err);
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'sksmartysabhya@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    console.log(err);
    res.redirect('/dashboardStudent');
  });
});

app.post('/reset/parent/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Parent.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'sksmartysabhya@gmail.com',
          pass: '12345sabu'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'sksmartysabhya@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/dashboardParent');
  });
});





















};
//checking logged in user
function isLoggedIn(req, res, next){
    console.log("isloggedin checking");
    console.log(req.isAuthenticated());
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
};
