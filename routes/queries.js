var express = require('express');
var router = express.Router();
const {queryModel} = require('../schemas/querySchema');
const mongoose = require('mongoose');
const {dbUrl} = require('../common/dbConfig');
mongoose.connect(dbUrl);

//EMAIL JS

const emailjs = require('@emailjs/nodejs');
const { mentorModel } = require('../schemas/mentorSchema');

const queryIds = ()=>{
    queryIDS = (Math.random() * 10000).toString().slice(6,10);
    return queryIDS
  }


router.get('/:email' , async(req, res)=>{
    try{
        let querybyMail = await queryModel.find({email:req.params.email});

        res.status(200).send({
            querybyMail
        })

    }
    catch(error){
        res.status(500).send({
            message:"Internal server error",
            error
        })
    }
})

router.get('/queryID/:queryID' , async(req, res)=>{
    try{
        let queryID = await queryModel.findOne({queryId:req.params.queryID});

        res.status(200).send({
            queryID,
            message:"Query for this ID fetched successfully!!"
        })

    }
    catch(error){
        res.status(500).send({
            message:"Internal server error",
            error
        })
    }
})

router.post('/addquery' , async (req, res)=>{
    try{
        let query = await queryModel.findOne({queryId: req.body.queryId});
        
        if(!query){

            queryIds();

            let query = await queryModel.create(req.body); 

            let QUERYID = `QN${queryIDS}`;            

            query.queryId = QUERYID;

            let mentors = await mentorModel.findOne({mentorId : QUERYID.slice(5)});

            await query.save()

            // var params = {
            //     to_mail: query.email,
            //     query_no: `QN${queryIDS}`,
            //     title : query.title,
            //     message: `Your Query is taken up. ${mentors.mentorName} will clarify your doubts at your scheduled time. Please be available.`
            // }
              
            //   emailjs
            //     .send('service_b7oqsko', 'template_g95pcp7', params, {
            //       publicKey: 'yYVMMzW7rNV0f4pnc',
            //       privateKey: '68aWyRUyd5qi2Nhn_PVUM', // optional, highly recommended for security reasons
            //     })
            //     .then(
            //       function (response) {
            //         console.log('SUCCESS!', response.status, response.text);
            //       },
            //       function (err) {
            //         console.log('FAILED...', err);
            //       },
            //     );

            res.status(200).send({
                message:"Query added successfully",
              })
        }else{
            res.status(400).send({
                message:"Unable to send this query"
              })
        }

    }
    catch(error){
        res.status(500).send({
            message:"Internal server error",
            error
        })
    }
})



module.exports = router;