//setting up routes
var express = require('express'),
app = express();
var path = require('path');
module.exports = function(app,passport){


app.get('/login', function(req, res){
    res.render('login.ejs',{message: req.flash('loginMessage')});
});

app.post('/login', passport.authenticate('login',{
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
}));

app.get('/register', function(req, res){
    //res.json({message: req.flash('registerMessage')});
    res.render('register.ejs',{message: req.flash('registerMessage')});    
});

app.post('/register', passport.authenticate('register',{
    successRedirect : '/profile',
    failureRedirect : '/register',
    failureFlash : true
}));

app.get('/profile', isLoggedIn, function(req,res){
    res.render('profile.ejs',{user : req.user});
});

app.get('/logout', function(req,res){
    req.logout();
    console.log("logout success");
    res.redirect('/');
});


app.get('/dashboardTeacher', function(req, res){
    res.render('dashboardTeacher.ejs'); 
});

app.get('/dashboardStudent', function(req, res){
    res.render('dashboardStudent.ejs'); 
});

app.get('/dashboardParent', function(req, res){
    res.render('dashboardParent.ejs'); 
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
