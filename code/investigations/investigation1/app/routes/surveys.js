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

// POST new survey
router.post('/surveys', function(req, res){
  
  var surveyName = req.body.surveyName;
  var introMessage = req.body.introMessage;
  var compMessage = req.body.compMessage;
  //var sectionIDs = req.body.sectionIDs;

  var newSurvey = {
    "surveyName": surveyName,
    "introductionMessage": introMessage,
    "completionMessage": compMessage
    //"questionText": introMessage
  };

  request.post({
    'url': 'https://reqressurveys.restlet.net/v1/surveys',
    'json': newSurvey
  }, function (error, response, body) {
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveys/' + body.id);
          }
        }).auth(user, pass);

});

// GET new survey page 
router.get('/surveys/new', function(req, res){ 
  
  request('https://reqressurveys.restlet.net/v1/surveySections', function (error, response, body) {
          
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      var data = JSON.parse(body);
      res.render("../views/surveys/new", {data});
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


// GET edit page for individual section
router.get('/surveys/:surveyid/edit', function(req, res){

  // get id from url
  surveyId = req.params.surveyid;

  var data = {};

  request('https://reqressurveys.restlet.net/v1/surveySections', function (error, response, body) {
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      this.data.section = JSON.parse(body);
      
      request('https://reqressurveys.restlet.net/v1/surveys/' + surveyId, function (error, response, body) {
      
      if(error){
          console.log('error:', error); // Print the error if one occurred and handle it
        } else {
          this.data.survey = JSON.parse(body);
          res.render("../views/surveys/edit", {data: this.data});
        }
      }.bind({data: this.data})).auth(user, pass);
    }
  }.bind({data: data})).auth(user, pass);

});


// Edit a specific survey
router.post('/surveys/:surveyid/edit', function(req, res){

  // Get data from from entry
  var surveyId = req.body.surveyId;
  var surveyName = req.body.surveyName;
  var introMessage = req.body.introMessage;
  var compMessage = req.body.compMessage;
  //var sectionIDs = req.body.sectionIDs;

  var editSurvey = {
    "surveyName": surveyName,
    "introductionMessage": introMessage,
    "completionMessage": compMessage
  };

  request.put({
    'url': 'https://reqressurveys.restlet.net/v1/surveys/' + surveyId,
    'json': editSurvey
  }, function (error, response, body) {
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveys/' + body.id);
          }
        }).auth(user, pass);

});


// GET delete survey page
router.get('/surveys/:surveyid/delete', function(req, res){

  // get id from url
  surveyId = req.params.surveyid;

  request('https://reqressurveys.restlet.net/v1/surveys/' + surveyId, function (error, response, body) {
          
      if(error){
        console.log('error:', error); // Print the error if one occurred and handle it
      } else {
        var data = JSON.parse(body);
        res.render("../views/surveys/delete", {data});
      }
    }).auth(user, pass);

});

// Delete a specific survey
router.post('/surveys/:surveyid/delete', function(req, res){

  // Get data from from entry
  var surveyId = req.body.surveyId;

  var deleteSurvey = {
    "surveyid": surveyId
  };

  request.delete({
    'url': 'https://reqressurveys.restlet.net/v1/surveys/' + surveyId,
    'json': deleteSurvey
  }, function (error, response, body) {
          // res.send(response);
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 204) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/surveys');
          }
        }).auth(user, pass);

});


module.exports = router;