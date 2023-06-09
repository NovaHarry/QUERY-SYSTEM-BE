const mongoose = require('mongoose');
const validator = require('validator');

let time = new Date();

const content = `${time.toUTCString().slice(0, -4)}`;

let querySchema = new mongoose.Schema({
    queryId:{type:String},
    category:{type:String, required:true},
    subCategory:{type:String, required:true},
    language:{type:String, required:true},
    title:{type:String, required:true},
    description:{type:String, required:true},
    time:{type:String, required:true},
    email:{
        type:String,
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        },
    },
    createdAt:{type:String, default: content},
    resolved:{type:String, default: "unresolved"},
    assignedMentor:{type:String}
},
{
    versionKey:false
}

)

let queryModel = mongoose.model('queries',querySchema);
module.exports={queryModel};