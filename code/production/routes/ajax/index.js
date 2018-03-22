const express = require('express');
const request = require('request');
const HttpStatus = require('status-codes');
const middleware = require("../../authenticate/middleware");
var router = express.Router();

// Load ajax routes
var surveys = require('./surveys');
var sections = require('./sections');
var questions = require('./questions');
var questionTypes = require('./questionTypes');

// Check user is logged in
router.use(middleware.isLoggedIn());

// Use routes
router.use('/surveys', surveys); 
router.use('/sections', sections); 
router.use('/questions', questions); 
router.use('/questionTypes', questionTypes);

// Ajax 404 error handler
router.use(function (req, res, next) {
  res.status(404).json({errorCode: 404, message: "Endpoint not found", details: "Sorry, we could not find this endpoint."});
})

// Ajax error handler
router.use(function (err, req, res, next) {
  console.log(err);
  // Set defaulterror template variables
  var httpStatus = HttpStatus[err.statusCode ? err.statusCode : 500]
  var errorCode = httpStatus.status;
  var message = httpStatus.name;
  var details = httpStatus.message;
  res.status(errorCode).json({errorCode, message, details, stack: err.stack});
})

module.exports = router;