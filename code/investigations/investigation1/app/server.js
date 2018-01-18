const express        = require('express');
const bodyParser     = require('body-parser');
const request        = require('request');
const app            = express();
const port = 8000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Routes
var questionRoutes        = require('./routes/questions');
var questionTypesRoutes   = require('./routes/questionTypes');
var surveyRoutes          = require('./routes/surveys');
var sectionRoutes         = require('./routes/sections');


// Home Page
app.get('/', function(req, res){
  res.render("index");
});


// Use Routes
app.use('/', questionRoutes);
app.use('/', questionTypesRoutes);
app.use('/', surveyRoutes);
app.use('/', sectionRoutes);

// Listen for server
app.listen(port, () => {
  console.log('Server Running: ' + port);
});