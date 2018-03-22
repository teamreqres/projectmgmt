const express = require('express');
const request = require('request');
const config = require('../config.js');
const Promise = require("bluebird");
const middleware = require("../authenticate/middleware");
const SectionModel = require('../models/Section.js');
const QuestionModel = require('../models/Question.js');
const SurveyModel = require('../models/Survey.js');
var router = express.Router();

// API connect details
const user =  config.restlet.username;
const baseEndpoint =  config.restlet.endpoint;

// Construct section model
const Sections = new SectionModel(baseEndpoint);
// Construct question model
const Questions = new QuestionModel(baseEndpoint);
// Construct survey model
const Surveys = new SurveyModel(baseEndpoint);

// Check user is logged in
router.use(middleware.isLoggedIn());

// Authenticate models with session data
router.use(function(req, res, next) {
  Questions.authenticate(req.user.username, req.user.password);
  Sections.authenticate(req.user.username, req.user.password);
  Surveys.authenticate(req.user.username, req.user.password);
  next();
});

// GET all sections
router.get('/', function(req, res, next) { 
  res.render("generic/index", {title: "Sections"});
});

// GET new section page 
router.get('/new', function(req, res, next) { 
  res.render("sections/edit");
});

// POST new section
router.post('/new', function(req, res, next) {
  
  var introMessage = req.body.sectionIntroduction;
  var heading = req.body.sectionName;

  var newSection = {
    "introductionMessage": introMessage,
    "heading": heading
  };

  Sections.create(newSection).then(function(result) {
    res.redirect('/sections/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});
  
// GET individual section
router.get('/:sectionId', function(req, res, next) {

  // get id from url
  sectionId = req.params.sectionId;

  var data = {};

  Sections.get(sectionId).then(function(section) {
    res.render("sections/edit", {section});
  }).catch(function(error) {
    next(error);
  });

});

// Edit a specific section
router.post('/:sectionId', function(req, res, next) {

  // Get data from from entry
  var sectionId = req.params.sectionId;
  var introMessage = req.body.sectionIntroduction;
  var heading = req.body.sectionName;
  var questions = [];

  // Check if questions are provided
  if (req.body.questions) {
    questions = req.body.questions;
  }

  // Add existing question is provided
  if (req.body.existingQuestion) {
    questions.push(req.body.existingQuestion);
  }

  // If existing question is to be removed
  if (req.body.removeRelated){
    // Check if question is in list of questions
    var index = questions.indexOf(req.body.removeRelated);
    if (index >= 0) {
      questions.splice( index, 1 );
    }
  }

  Promise.resolve().then(function () {
    // Create new Question
    if (req.body.newQuestion) {
      return Questions.create({"questionText": req.body.newQuestion, "questionType": "FREE_TEXT"});
    }
  }).then(function(result) {
    // If new question provided, push new id into questions array
    if (result) {
      questions.push(result.id);
    }

    // Create Section Body
    var editSection = {
      "introductionMessage": introMessage,
      "heading": heading,
      "questionIds": questions
    }
    return editSection

  }).then(function(editSection) {
    return Sections.update(sectionId, editSection);
  }).then(function(result) {
    res.redirect('/sections/' + result.id);
  }).catch(function(error) {
    next(error);
  });

});


// GET delete section page
router.get('/:sectionId/delete', function(req, res, next) {
  
  // get id from url
  sectionId = req.params.sectionId;

  Sections.get(sectionId).then(function(result) {
    res.render("generic/delete", {title: "Sections", data: result});
  }).catch(function(error) {
    next(error);
  });

});

// Delete a specific section
router.post('/:sectionId/delete', function(req, res, next) {

  // Get data from from entry
  var sectionId = req.body.sectionId;

  Sections.delete(sectionId).then(function(result) {
    res.redirect('/sections');
  }).catch(function(error) {
    next(error);
  });

});

module.exports = router;