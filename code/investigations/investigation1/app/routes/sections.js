const express = require('express');
const request = require('request');
var router = express.Router();

// auth details
const user =  '';
const pass =  '';

// GET all survey sections
router.get('/surveySections', function(req, res){ 

    request('https://reqressurveys.restlet.net/v1/surveySections', function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/sections/index", {data});
          }
        }).auth(user, pass);
});

// POST new section
router.post('/surveySections', function(req, res){
  
  var introMessage = req.body.introMessage;
  var heading = req.body.heading;
  //var IDs = [];

  var newSection = {
    "introductionMessage": introMessage,
    //"questionIds": IDs,
    "heading": heading
  };

  request.post({
    'url': 'https://reqressurveys.restlet.net/v1/surveySections',
    'json': newSection
  }, function (error, response, body) {
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveySections/' + body.id);
          }
        }).auth(user, pass);

});

// GET new section page 
router.get('/surveySections/new', function(req, res){ 
  
  request('https://reqressurveys.restlet.net/v1/questions', function (error, response, body) {
          
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      var data = JSON.parse(body);
      
      res.render("../views/sections/new", {data});
    }
  }).auth(user, pass);

});
  
// GET individual survey section
router.get('/surveySections/:surveySectionid', function(req, res){ 

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

// GET edit page for individual section
router.get('/surveySections/:surveySectionid/edit', function(req, res){

  // get id from url
  surveySectionId = req.params.surveySectionid;

  var data = {};

  request('https://reqressurveys.restlet.net/v1/questions', function (error, response, body) {
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      this.data.question = JSON.parse(body);
      
      request('https://reqressurveys.restlet.net/v1/surveySections/' + surveySectionId, function (error, response, body) {      
        if(error){
          console.log('error:', error); // Print the error if one occurred and handle it
        } else {
          this.data.section = JSON.parse(body);
          res.render("../views/sections/edit", {data: this.data});
        }
      }.bind({data: this.data})).auth(user, pass);
    }
  }.bind({data: data})).auth(user, pass);

});

// Edit a specific section
router.post('/surveySections/:surveySectionid/edit', function(req, res){

  // Get data from from entry
  var sectionId = req.body.sectionId;
  var introMessage = req.body.introMessage;
  var heading = req.body.heading;
  //var questionChoice = req.body.questionChoice;

  var editSection = {
    "introductionMessage": introMessage,
    "heading": heading
  };

  request.put({
    'url': 'https://reqressurveys.restlet.net/v1/surveySections/' + sectionId,
    'json': editSection
  }, function (error, response, body) {
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveySections/' + body.id);
          }
        }).auth(user, pass);

});


// GET delete section page
router.get('/surveySections/:surveySectionid/delete', function(req, res){

  // get id from url
  surveySectionid = req.params.surveySectionid;

  request('https://reqressurveys.restlet.net/v1/surveySections/' + surveySectionid, function (error, response, body) {
          
      if(error){
        console.log('error:', error); // Print the error if one occurred and handle it
      } else {
        var data = JSON.parse(body);
        res.render("../views/sections/delete", {data});
      }
    }).auth(user, pass);

});

// Delete a specific section
router.post('/surveySections/:surveySectionid/delete', function(req, res){

  // Get data from from entry
  var surveySectionId = req.body.surveySectionId;

  var deleteSection = {
    "surveySectionid": surveySectionId
  };

  request.delete({
    'url': 'https://reqressurveys.restlet.net/v1/surveySections/' + surveySectionId,
    'json': deleteSection
  }, function (error, response, body) {
          // res.send(response);
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 204) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveySections');
          }
        }).auth(user, pass);

});


module.exports = router;