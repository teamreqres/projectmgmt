const express = require('express');
const request = require('request');
const config = require('../../config.js');
const middleware = require("../../authenticate/middleware");
const QuestionModel = require('../../models/Question.js');
var router = express.Router();

// API connect details
const baseEndpoint =  config.restlet.endpoint;

// Construct question model
const Questions = new QuestionModel(baseEndpoint);

// GET all question types
router.get('/', function(req, res, next) {

  //Authenticate model with current user details
  Questions.authenticate(req.user.username, req.user.password);

  Questions.getTypes().then(function(result) {
    res.json(result);
  }).catch(function(error) {
    next(error);
  });

});


module.exports = router;