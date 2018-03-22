/*
 * reqRes
 * Survey Builder
 */

// Require Modules
const express = require('express'),
      bodyParser = require('body-parser'),
      request = require('request'),
      HttpStatus = require('status-codes');

// Create express instance
const app = express();
const port = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));

// Setup Passport
const passport = require('passport'),
      session = require('express-session'),
      LocalStrategy = require('passport-local').Strategy,
      isLoggedIn = require('./authenticate/middleware');

// Load Survey Model for authentication
const SurveyModel = require('./models/Survey'),
      // API connect details
      baseEndpoint =  require('./config.js').restlet.endpoint,
      // Construct survey model
      Surveys = new SurveyModel(baseEndpoint);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {

    //Authenticate model with current user details
    Surveys.authenticate(username, password);

    // Attempt loading surveys from Restlet
    Surveys.getAll().then(function() {
      return done(null, {username, password} );
    }).catch(function(error) {
      // Return false user object if error occured
      return done(null, false, {message: "Login failed. Please try again."});
    });

  }
));

passport.isLoggedIn = isLoggedIn;

app.use(session({
  secret: "test",
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Load routers
var surveyRoutes = require('./routes/surveys'),
    sectionRoutes = require('./routes/sections'),
    questionRoutes = require('./routes/questions');
    ajaxRouter = require('./routes/ajax');


// Home Page
app.get('/', function(req, res) {
  res.redirect('/login');
});

app.get('/login', function(req, res) {
  res.render('generic/login');
});

app.post('/login',
passport.authenticate('local', 
  { failureRedirect: '/login' }
), function(req, res) {
  res.redirect('/surveys');
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

// Use Routes
app.use('/surveys', surveyRoutes);
app.use('/questions', questionRoutes);
app.use('/sections', sectionRoutes);
app.use('/ajax', ajaxRouter);

// Add static route
app.use('/static', express.static(__dirname + '/public'));

// Set 404 error handler
app.use(function (req, res, next) {
  res.status(404).render("generic/error", {errorCode: 404, message: "Page not found", details: "Sorry, we could not find this page."});
})

// Set default error handler
app.use(function (err, req, res, next) {
  // Set defaulterror template variables
  var httpStatus = HttpStatus[err.statusCode ? err.statusCode : 500]
  var errorCode = httpStatus.status;
  var message = httpStatus.name;
  var details = httpStatus.message;

  // Check if error has messages
  // if (err.error.messages) {
  //   var details = "";
  //   var messages = err.error.messages;
  //   console.log(messages.length);
  //   for (var i = 0; i < messages.length ; i++) {
  //     details += messages[i].property ? messages[i].property + ': ' : '';
  //     details += messages[i].message;
  //   }
  // }

  console.error(err.stack)
  res.status(errorCode).render("generic/error", {errorCode, message, details, stack: err.stack});
})

// Set port for server to listen for requests
app.listen(port, () => {
  console.log('Server Running: ' + port);
});