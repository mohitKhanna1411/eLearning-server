var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var parentSchema = mongoose.Schema({
    username:{
        type: String,
        unique:true
    },
    password:{
        type: String
    },
	Qualification:{
        type: String
    },
	job_description:{
        type: String
    },
	grade:{
        type: String
    },
    student_id:{
        type : String
    },
	fav_subject:{
        type: String
    },
  
});

parentSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};
parentSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Parent',parentSchema);
