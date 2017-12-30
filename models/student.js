var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

var studentSchema = mongoose.Schema({
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
    student_id:{
        type: String,
        unique:true,
        required: true
    },
	email:{
        type: String,
        unique: true,
        required: true
    },
	grade:{
        type: String
    },
    teacher_id:{
        type : String
    },
    parent_id:{
        type : String
    },
	last_lesson:{
        type: String
    },
    fav_subject:{
        type: String
    },
	aadhar:{
        type: String
    },
	school:{
        type: String
    },
	address:{
        type: String
    },
	contact:{
        type: String
    }
  
});

studentSchema.plugin(passportLocalMongoose)


studentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
studentSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Student',studentSchema);
