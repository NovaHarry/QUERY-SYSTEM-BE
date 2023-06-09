var express = require('express');
var router = express.Router();
const {userDataModel} = require('../schemas/userSchema');
const { hashCompare, hashPassword, createToken } = require('../common/auth');
const mongoose = require('mongoose');
const {dbUrl} = require('../common/dbConfig');
mongoose.connect(dbUrl);

// EMAIL JS

const emailjs = require('@emailjs/nodejs');
const { queryModel } = require('../schemas/querySchema');


const randomStringss = ()=>{
    randomStrings = Math.random().toString(36).substring(2,15);
    return randomStrings
  } 
  
/* GET ALL USER DATA */
router.post('/login', async function(req, res, next) {
    try{
      let userByID = await userDataModel.findOne({email:req.body.email});
      let queries = await queryModel.find({email:req.body.email});

      
      if(Boolean(userByID) == true && await hashCompare(req.body.password, userByID.password)){

        let token = await createToken({
          userName:userByID.userName,
          email:userByID.email,
          id:userByID._id
        })

        res.status(200).send({
          queries,
          token,
          message:"User Login Successfull"
      }
      )
      }
      else{
        res.status(400).send({
          message:"Your Email ID or Password is incorrect."
      })
    }}
    catch (error){
      res.status(500).send({
        message:"Your Email ID or Password is incorrect.",
        error
    })
  }
  });

  // ADD NEW USER DATA

router.post('/adduser',async(req, res)=>{
  try{
    let user = await userDataModel.findOne({email:req.body.email});
    if(!user){

    //HASHING PASSWORD

    let hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;


    let user = await userDataModel.create(req.body);
    res.status(200).send({
      message:"User added successfully",
    })
  }else{
      res.status(400).send({
          message:"User already exist!"
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

// FORGOT PASSWORD 

router.get('/forgotpassword/:email',async(req, res)=>{
  try{
    let userByID = await userDataModel.findOne({email:req.params.email});

    
    if(userByID){     


      randomStringss();
      
      userByID.randomString = randomStrings;

      await userByID.save()

      console.log(randomStrings);

      var params = {
          to_mail: userByID.email,
          from_name: "FORTGOT PASSWORD LINK",
          subject : "Click the link to reset your account password",
          message: `${process.env.BASE_URL}/users/update-password/${randomStrings}`
      }
        
        emailjs
          .send('service_t364cq5', 'template_zkvk5ew', params, {
            publicKey: 'dV0PoYKs_CmKQCKVP',
            privateKey: 'EQD4YMN0vFUhlVUhbk__R', // optional, highly recommended for security reasons
          })
          .then(
            function (response) {
              console.log('SUCCESS!', response.status, response.text);
            },
            function (err) {
              console.log('FAILED...', err);
            },
          );


      res.status(200).send({
      userByID,
      message:"User data for the ID fetched successfully"
    }
    )}
    else{
      res.status(400).send({
          message:"There is no data available for this ID"
        })
    }

  }
  catch (error){
    res.status(404).send({
      message:"There is no data available for this ID",
      error
  })
}
});

// RESETTING PASSWORD

router.put('/update-password/:randomString',async(req, res)=>{
  try{
    let user = await userDataModel.findOne({randomString:req.params.randomString});
    
    if(user){
      let hashedPassword = await hashPassword(req.body.password);

      user.password = hashedPassword;

      user.randomString = "";

      await user.save()

    res.status(200).send({
      message:"Password updated successfully"
    })
  }else{
      res.status(400).send({
          message:"You've entered into an incorrect link or the expired link. Try generating a new link."
        })
  }
  }
  catch (error){
    res.status(500).send({
      message:"You've entered into an incorrect link or the expired link. Try generating a new link.",
      error
  })
}
});








  module.exports = router;