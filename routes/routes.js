//setting up routes
var express = require('express'),
app = express();
var path = require('path');
module.exports = function(app,passport){


app.get('/', function(req, res){
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