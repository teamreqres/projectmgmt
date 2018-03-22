const express = require('express');
const request = require('request');
const config = require('../config.js');
const middleware = require("../authenticate/middleware");
const QuestionModel = require('../models/Question.js');
const SectionModel = require('../models/Section.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct question model
const Questions = new QuestionModel(baseEndpoint);
// Construct section model
const Sections = new SectionModel(baseEndpoint);

// Check user is logged in
router.use(middleware.isLoggedIn());

// Authenticate models with session data
router.use(function(req, res, next) {
  Questions.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  next();
});

// GET all questions
router.get('/', function(req, res, next) { 
  res.render("generic/index", {title: "Questions"});
});

// GET new question page 
router.get('/new', function(req, res, next) { 
  res.render("questions/edit");
});

// POST new question
router.post('/new', function(req, res, next) {
  
  var questionName = req.body.questionName;
  var questionType = req.body.questionType;
  var questionChoices = req.body.questionChoices;

  var newQuestion = {
    "questionType": questionType,
    "questionText": questionName,
    "questionChoices": questionChoices
  };

  Questions.create(newQuestion).then(function(result) {
    res.redirect('/questions/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});

// GET individual question
router.get('/:questionId', function(req, res, next) {

  // get id from url
  questionId = req.params.questionId;

  var data = {};

  Questions.get(questionId).then(function(question) {
    res.render("questions/edit", {question});
  }).catch(function(error) {
    next(error);
  });

});

// Update a specific question
router.post('/:questionId', function(req, res, next) {

  // Get data from submission
  var questionId = req.params.questionId;
  var questionName = req.body.questionName;
  var questionType = req.body.questionType;
  var questionChoices = req.body.questionChoices;

  var editQuestion = {
    "questionType": questionType,
    "questionText": questionName,
    "questionChoices": questionChoices
  };

  Questions.update(questionId, editQuestion).then(function(result) {
    res.redirect('/questions/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});

// GET delete question page
router.get('/:questionId/delete', function(req, res, next) {

  // get id from url
  questionId = req.params.questionId;

  Questions.get(questionId).then(function(result) {
    res.render("generic/delete", {title: "Questions", data: result});
  }).catch(function(error) {
    next(error);
  });

});

// Delete a specific question
router.post('/:questionId/delete', function(req, res, next) {

  // Get data from from entry
  var questionId = req.body.questionId;

  Questions.delete(questionId).then(function(result) {
    res.redirect('/questions');
  }).catch(function(error) {
    next(error);
  });

});

module.exports = router;