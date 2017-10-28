var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var studentSchema = mongoose.Schema({
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
	grade:{
        type: String
    },
    teacher_id:{
        type : String
    },
	fav_subject:{
        type: String
    }
  
});

studentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
studentSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Student',studentSchema);
