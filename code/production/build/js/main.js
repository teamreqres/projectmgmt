/*
 * reqRes
 * Survey Builder
 * 
 * app.js
 * - Handles interactive elements of front-end
 */

$(document).ready( function() {
	
	// Initialise Editors
	var surveyEditor = new SurveyEditor('#surveyEditor');
	var sectionEditor = new SectionEditor('#sectionEditor');
	var questionEditor = new QuestionEditor('#questionEditor');

	// Initialise sidebar
	$("#sidebar").sidebar();

});


