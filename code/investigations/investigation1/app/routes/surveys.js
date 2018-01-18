const express = require('express');
const request = require('request');
var router = express.Router();

// auth details
const user =  '';
const pass =  '';


// GET all surveys
router.get('/surveys', function(req, res){ 

    request('https://reqressurveys.restlet.net/v1/surveys', function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/surveys/index", {data});
          }
        }).auth(user, pass);
    });
  
  // GET individual survey 
  router.get('/surveys/:surveyid', function(req, res){ 
  
    // get id from url
    surveyid = req.params.surveyid;
  
    request('https://reqressurveys.restlet.net/v1/surveys/' + surveyid, function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/surveys/view", {data});
          }
        }).auth(user, pass);
    });


module.exports = router;