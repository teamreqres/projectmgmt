const express = require('express');
const request = require('request');
const config = require('../../config.js');
const middleware = require("../../authenticate/middleware");
const SurveyModel = require('../../models/Survey.js');
const SectionModel = require('../../models/Section.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct models
const Surveys = new SurveyModel(baseEndpoint);
const Sections = new SectionModel(baseEndpoint);
 
// Authenticate models with session data
router.use(function(req, res, next) {
  Surveys.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  next();
});

// GET all surveys
router.get('/', function(req, res, next) {

  Surveys.getAll().then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET surveys
router.get('/:surveyId', function(req, res, next) {

  // get id from url
  surveyId = req.params.surveyId;

  Surveys.get(surveyId).then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});

// GET sections assigned to survey
router.get('/:surveyId/sections', function(req, res, next) {

  // get id from url
  surveyId = req.params.surveyId;

  // Get section ids from specified survey
  Surveys.get(surveyId).then(function(result) {
    return result.sectionIds;
  })
  // Get sections
  .map(function(section) {
    return Sections.get(section);
  }).then(function(result) {
    res.json(result);
  })
  // Catch errors
  .catch(function(error) {
    next(error);
  });

});

module.exports = router;