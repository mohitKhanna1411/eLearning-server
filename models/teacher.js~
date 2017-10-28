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
	qualification:{
        type: String
    },
	job_description:{
        type: String
    },
    teaching_experience:{
        type: Number
    },
	grade:{
        type: String
    },
	fav_subject:{
        type: String
    }
  
});

teacherSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
teacherSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Teacher',teacherSchema);
