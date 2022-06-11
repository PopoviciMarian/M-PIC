let mongodb = require("mongoose")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let userSchema = new mongodb.Schema(
    {
        name:{type:String, required:true},
        email:{type:String, required:true},
        password:{type:String, required:true}
    },
    {
        timestamps: true
    }
)

let userCollection = mongodb.model('User', userSchema, 'users')

class UserModel{
   
}

let model = new UserModel();

module.exports = model;