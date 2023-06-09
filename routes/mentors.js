var express = require('express');
var router = express.Router();
const {mentorModel} = require('../schemas/mentorSchema');
const mongoose = require('mongoose');
const {dbUrl} = require('../common/dbConfig');
mongoose.connect(dbUrl);



router.get('/', async function(req, res){
    try{
        let mentors = await mentorModel.find();

    console.log(content)

        res.status(200).send({
            mentors,
            message:"Mentor data fetched successfully"
        })

    }
    catch(error){
        res.status(500).send({
            message:"Internal server error",
            error
        })
}
})

// ADD NEW MENTOR DATA

router.post('/addmentor',async(req, res)=>{
    try{
      let mentor = await mentorModel.findOne({mentorId:req.body.mentorId});

      if(!mentor){
      let mentor = await mentorModel.create(req.body);
      res.status(200).send({
        message:"Mentor added successfully"
      })
    }else{
        res.status(400).send({
            message:"Mentor already exist!"
          })
    }
    }
    catch (error){
      res.status(500).send({
        message:"Internal server error",
        error
    })
  }
  });



module.exports = router;