var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var teacherSchema = mongoose.Schema({
    username:{
        type: String,
        unique:true
    },
    password:{
        type: String
    },
    role:{
        type: String
    },
    email_id:{
        type: String
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
    teaching_experience:{
        type: Number
    }
});

teacherSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
teacherSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Teacher',teacherSchema);
