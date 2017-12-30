var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require("passport-local-mongoose");

var teacherSchema = mongoose.Schema({
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
    teacher_id:{
        type: String,
        unique : true,
        required: true
    },
    email_id:{
        type: String,
        unique: true,
        required: true
    },
	address:{
        type: String
    },
    contact_number:{
        type: String
    },
    aadhar_no:{
        type: String
    },
    qualification:{
        type: String
    },
	job_description:{
        type: String
    },
    last_lesson:{
        type: String
    },
    teaching_experience:{
        type: Number
    }
});

teacherSchema.plugin(passportLocalMongoose)


teacherSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
teacherSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Teacher',teacherSchema);
