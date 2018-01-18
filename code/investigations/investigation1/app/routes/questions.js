const express = require('express');
const request = require('request');
var router = express.Router();

// auth details
const user =  '';
const pass =  '';

// GET all questions
router.get('/questions', function(req, res){ 

    request('https://reqressurveys.restlet.net/v1/questions', function (error, response, body) {
          
          if(error){
            console.log('error:', error); // Print the error if one occurred and handle it
          } else {
            var data = JSON.parse(body);
            res.render("../views/questions/index", {data});
          }
        }).auth(user, pass);
    });

// POST new question
router.post('/questions', function(req, res){
  
  var questionName = req.body.questionName;
  var questionType = req.body.questionType;
  //var questionChoice = req.body.questionChoice;

  var newQuestion = {
    "questionType": questionType,
    "questionText": questionName
  };

  request.post({
    'url': 'https://reqressurveys.restlet.net/v1/questions',
    'json': newQuestion
  }, function (error, response, body) {
          console.log(newQuestion);
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/questions/' + body.id);
          }
        }).auth(user, pass);

});

// GET new question page 
router.get('/questions/new', function(req, res){ 
  
  request('https://reqressurveys.restlet.net/v1/questionTypes', function (error, response, body) {
          
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      var data = JSON.parse(body);
      res.render("../views/questions/new", {data});
    }
  }).auth(user, pass);

});
  
// GET individual question 
router.get('/questions/:questionid', function(req, res){ 
  
    // get id from url
    questionid = req.params.questionid;
  
    request('https://reqressurveys.restlet.net/v1/questions/' + questionid, function (error, response, body) {
          
      if(error){
        console.log('error:', error); // Print the error if one occurred and handle it
      } else {
        var data = JSON.parse(body);
        res.render("../views/questions/view", {data});
      }
    }).auth(user, pass);
});

// GET edit page for individual question
router.get('/questions/:questionid/edit', function(req, res){

  // get id from url
  questionid = req.params.questionid;

  var data = {};

  request('https://reqressurveys.restlet.net/v1/questionTypes', function (error, response, body) {
    if(error){
      console.log('error:', error); // Print the error if one occurred and handle it
    } else {
      this.data.questionType = JSON.parse(body);
      
      request('https://reqressurveys.restlet.net/v1/questions/' + questionid, function (error, response, body) {      
        if(error){
          console.log('error:', error); // Print the error if one occurred and handle it
        } else {
          this.data.question = JSON.parse(body);
          res.render("../views/questions/edit", {data: this.data});
        }
      }.bind({data: this.data})).auth(user, pass);
    }
  }.bind({data: data})).auth(user, pass);

});

// Edit a specific question
router.post('/questions/:questionid/edit', function(req, res){

  // Get data from from entry
  var questionId = req.body.questionId;
  var questionName = req.body.questionName;
  var questionType = req.body.questionType;
  //var questionChoice = req.body.questionChoice;

  var editQuestion = {
    "questionType": questionType,
    "questionText": questionName
  };

  request.put({
    'url': 'https://reqressurveys.restlet.net/v1/questions/' + questionId,
    'json': editQuestion
  }, function (error, response, body) {
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 200) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/questions/' + body.id);
          }
        }).auth(user, pass);

});

// GET delete question page
router.get('/questions/:questionid/delete', function(req, res){

  // get id from url
  questionid = req.params.questionid;

  request('https://reqressurveys.restlet.net/v1/questions/' + questionid, function (error, response, body) {
          
      if(error){
        console.log('error:', error); // Print the error if one occurred and handle it
      } else {
        var data = JSON.parse(body);
        res.render("../views/questions/delete", {data});
      }
    }).auth(user, pass);

});

// Delete a specific question
router.post('/questions/:questionid/delete', function(req, res){

  // Get data from from entry
  var questionId = req.body.questionId;

  var deleteQuestion = {
    "questionid": questionId
  };

  request.delete({
    'url': 'https://reqressurveys.restlet.net/v1/questions/' + questionId,
    'json': deleteQuestion
  }, function (error, response, body) {
          // res.send(response);
          if(error){
            res.send(error); // Print the error if one occurred and handle it
          } else if(response.statusCode != 204) {
            res.send(response.statusMessage);
          } else {
            res.redirect('/questions');
          }
        }).auth(user, pass);

});



module.exports = router;