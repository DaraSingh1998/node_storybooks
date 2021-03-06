const mongoose = require('mongoose');
const Schema=mongoose.Schema;

// Create Schema
const UsersSchema=new Schema({
  googleID:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  img:{
    type:String
  }
});

// Create collection and add schema
// mongoose.model('users', UsersSchema);
const User=mongoose.model('User',UsersSchema);

module.exports={
  User
};
