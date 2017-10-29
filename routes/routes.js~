//setting up routes
var express = require('express'),
app = express();
var path = require('path');
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



app.get('/dashboardTeacher', function(req, res){
    res.render('dashboardTeacher.ejs'); 
});

app.get('/dashboardStudent', function(req, res){
    res.render('dashboardStudent.ejs'); 
});

app.get('/dashboardParent', function(req, res){
    res.render('dashboardParent.ejs'); 
});



app.get('/logout', function(req,res){
    req.logout();
    console.log("logout success");
    res.redirect('/');
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
