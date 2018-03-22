const express = require('express');
const request = require('request');
const config = require('../../config.js');
const middleware = require("../../authenticate/middleware");
const QuestionModel = require('../../models/Question.js');
const SectionModel = require('../../models/Section.js');
const SurveyModel = require('../../models/Survey.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct models
const Questions = new QuestionModel(baseEndpoint);
const Sections = new SectionModel(baseEndpoint);
const Surveys = new SurveyModel(baseEndpoint);

// Authenticate models with session data
router.use(function(req, res, next) {
  Questions.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  Surveys.authenticate(req.user.username, req.user.password);
  next();
});

// GET all sections
router.get('/', function(req, res, next) {

  Sections.getAll().then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET section
router.get('/:sectionId', function(req, res, next) {

  // get id from url
  sectionId = req.params.sectionId;

  Sections.get(sectionId).then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET questions assigned to section
router.get('/:sectionId/questions', function(req, res, next) {

  // get id from url
  sectionId = req.params.sectionId;

  // Get question ids from specified section
  Sections.get(sectionId).then(function(result) {
    return result.questionIds;
  })
  // Get questions
  .map(function(question) {
    return Questions.get(question);
  }).then(function(result) {
    res.json(result);
  })
  // Catch errors
  .catch(function(error) {
    next(error);
  });

});

// GET related surveys that section is assigned to
router.get('/:sectionId/assignedTo', function(req, res, next) {

  // get id from url
  sectionId = req.params.sectionId;

  Surveys.getAllByAssignedSection(sectionId).then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});



module.exports = router;