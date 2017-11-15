//setting up routes
var express = require('express'),
app = express();
var path = require('path');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

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
    //res.json({message: req.flash('registerMessage')});
    res.render('register.ejs');    
});

    app.get('/studentRegister', function(req, res){
    //res.json({message: req.flash('registerMessage')});
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
  res.render('forgot');
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
      User.findOne({ email: req.body.email }, function(err, user) {
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
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'learntocodeinfo@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
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
          user: 'learntocodeinfo@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
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
    res.redirect('/login');
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
