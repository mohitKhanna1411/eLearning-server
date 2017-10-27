//logic for user authentication, passport strategy used
var LocalStrategy = require('passport-local').Strategy;
var Auth = require('../models/user');
module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        Auth.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('register',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username, password, done) {
        Auth.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, req.flash('registerMessage','Username is already taken...' ));
            }else{
                var newUser = new Auth();
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null,newUser);
                });
            }
        });
    }));

    passport.use('login',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback:true
    },
    function(req,username, password, done) {
        Auth.findOne({ username: username }, function(err, user) {
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
    ));
};
