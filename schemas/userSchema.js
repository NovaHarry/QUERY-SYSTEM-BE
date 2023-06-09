const mongoose = require('mongoose');
const validator = require('validator');

let userDataSchema = new mongoose.Schema(
    {
        userName:{type:String,required:true},
        email:{
            type:String,
            required:true,
            lowercase:true,
            validate:(value)=>{
                return validator.isEmail(value)
            },
        },
        password:{type:String,required:true},
        randomString:{type:String},
        createdAt:{type:Date,default:Date.now}
        },
    {
        versionKey:false
    }
)

let userDataModel = mongoose.model('users', userDataSchema);
module.exports={userDataModel};