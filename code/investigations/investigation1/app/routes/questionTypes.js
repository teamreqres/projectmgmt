const express = require('express');
const request = require('request');
var router = express.Router();

// auth details
const user =  '';
const pass =  '';

// GET all questions types
router.get('/questionTypes', function(req, res){ 

    request('https://reqressurveys.restlet.net/v1/questionTypes', function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/questionTypes", {data});
          }
        }).auth(user, pass);
    });
  
// GET individual question type
router.get('/questionTypes/:questionTypeid', function(req, res){ 
  
    // get id from url
    questionTypeid = req.params.questionTypeid;
  
    request('https://reqressurveys.restlet.net/v1/questionTypes/' + questionTypeid, function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/questionType", {data});
          }
        }).auth(user, pass);
});


module.exports = router;