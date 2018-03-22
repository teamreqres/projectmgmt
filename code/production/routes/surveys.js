const express = require('express');
const request = require('request');
const config = require('../config.js');
const Promise = require("bluebird");
const middleware = require("../authenticate/middleware");
const SurveyModel = require('../models/Survey.js');
const SectionModel = require('../models/Section.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct survey model
const Surveys = new SurveyModel(baseEndpoint);
// Construct section model
const Sections = new SectionModel(baseEndpoint);

// Check user is logged in
router.use(middleware.isLoggedIn());

// Authenticate models with session data
router.use(function(req, res, next) {
  Surveys.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  next();
});

// GET all surveys
router.get('/', function(req, res, next) {
  res.render("generic/index", {title: "Surveys"});
});

// GET new survey page 
router.get('/new', function(req, res, next) {
  res.render("surveys/edit");
});

// POST new survey
router.post('/new', function(req, res, next) {
  
  var surveyName = req.body.surveyName;
  var introMessage = req.body.introMessage;
  var compMessage = req.body.compMessage;

  var newSurvey = {
    "surveyName": surveyName,
    "introductionMessage": introMessage,
    "completionMessage": compMessage
  };

  Surveys.create(newSurvey).then(function(result) {
    res.redirect('/surveys/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});
  
// GET individual survey 
router.get('/:surveyId', function(req, res, next) { 

  // get id from url
  surveyId = req.params.surveyId;  // get id from url

  Surveys.get(surveyId).then(function(survey) {
    res.render("surveys/edit", {survey});
  }).catch(function(error) {
    next(error);
  });

});


// Edit a specific survey
router.post('/:surveyId', function(req, res, next) {

  // Get data from from entry
  var surveyId = req.params.surveyId;
  var surveyName = req.body.surveyName;
  var introMessage = req.body.surveyIntroduction;
  var compMessage = req.body.surveyCompletion;
  var sections = [];

  // Check if sections are provided
  if (req.body.sections) {
    sections = req.body.sections;
  }

  // Add existing section is provided
  if (req.body.existingSection) {
    sections.push(req.body.existingSection);
  }

  // If existing section is to be removed
  if (req.body.removeRelated){
    // Check if section is in list of sections
    var index = sections.indexOf(req.body.removeRelated);
    if (index >= 0) {
      sections.splice( index, 1 );
    }
  }

  Promise.resolve().then(function () {
    // Create new Section
    if (req.body.newSection) {
      return Sections.create({"heading": req.body.newSection});
    }
  }).then(function(result) {
    // If new section provided, push new section into sections array
    if (result) {
      sections.push(result.id);
    }

    // Create Survey Body
    var editSurvey = {
      "surveyName": surveyName,
      "introductionMessage": introMessage,
      "completionMessage": compMessage,
      "sectionIds": sections
    }
    return editSurvey

  }).then(function(editSurvey) {
    return Surveys.update(surveyId, editSurvey);
  }).then(function(result) {
    res.redirect('/surveys/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});


// GET delete survey page
router.get('/:surveyId/delete', function(req, res, next) {

  // get id from url
  surveyId = req.params.surveyId;

  Surveys.get(surveyId).then(function(result) {
    res.render("generic/delete", {title: "Surveys", data: result});
  }).catch(function(error) {
    next(error);
  });

});

// Delete a specific survey
router.post('/:surveyId/delete', function(req, res, next) {

  // Get data from from entry
  var surveyId = req.body.surveyId;

  Surveys.delete(surveyId).then(function(result) {
    res.redirect('/surveys');
  }).catch(function(error) {
    next(error);
  });

});


module.exports = router;