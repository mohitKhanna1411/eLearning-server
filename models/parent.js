var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

var parentSchema = mongoose.Schema({
    username:{
        type: String,
        unique:true,
        required: true
    },
    password:{
        type: String
    },
    resetPasswordToken:{
        type : String
    },
    resetPasswordExpires: {
        type : Date
    },
    role:{
        type: String
    },
    parent_id:{
        type: String,
        unique:true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    }, 
	job_description:{
        type: String
    },
	qualification:{

        type: String
    },
	address:{
        type: String
    },
    student_id:{
        type : String
    },
	aadhar:{
        type: String
    },
	contact:{
        type: String
    }
});

parentSchema.plugin(passportLocalMongoose)


parentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
parentSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Parent',parentSchema);
