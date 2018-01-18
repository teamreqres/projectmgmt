const express = require('express');
const request = require('request');
var router = express.Router();

// auth details
const user =  '';
const pass =  '';

// GET all survey sections
router.get('/sections', function(req, res){ 

    request('https://reqressurveys.restlet.net/v1/surveySections', function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/sections/index", {data});
          }
        }).auth(user, pass);
    });
  
  // GET individual survey section
  router.get('/sections/:surveySectionid', function(req, res){ 
  
    // get id from url
    surveySectionid = req.params.surveySectionid;
  
    request('https://reqressurveys.restlet.net/v1/surveySections/' + surveySectionid, function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/sections/view", {data});
          }
        }).auth(user, pass);
    });


module.exports = router;