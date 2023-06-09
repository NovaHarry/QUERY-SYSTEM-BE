const mongoose = require('mongoose');

let mentorSchema = new mongoose.Schema(
    {
        mentorId:{type:Number,required:true},
        mentorName:{type:String, required:true}
    },
    {versionKey:false}
)

let mentorModel = mongoose.model('mentors', mentorSchema);

module.exports = {mentorModel};

