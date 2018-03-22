const express = require('express');
const request = require('request');
const config = require('../../config.js');
const middleware = require("../../authenticate/middleware");
const QuestionModel = require('../../models/Question.js');
const SectionModel = require('../../models/Section.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct question model
const Questions = new QuestionModel(baseEndpoint);
const Sections = new SectionModel(baseEndpoint);

// Authenticate models with session data
router.use(function(req, res, next) {
  Questions.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  next();
});

// GET all questions
router.get('/', function(req, res, next) {

  Questions.getAll().then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET question
router.get('/:questionId', function(req, res, next) {

  // get id from url
  questionId = req.params.questionId;

  Questions.get(questionId).then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET related sections that question is assigned to
router.get('/:questionId/assignedTo', function(req, res, next) {

  // get id from url
  questionId = req.params.questionId;

  Sections.getAllByAssignedQuestion(questionId).then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});


module.exports = router;