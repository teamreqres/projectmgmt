/*
 * reqRes
 * Survey Builder
 * 
 * SectionEditor.js
 * - Handles display and functionality of the Survey Editor
 */


function SurveyEditor(target) {

	this.survey = {};
	this.target = $(target);

	this.init = function() {

		// Get survey id from editor element
		var surveyId = $(target).attr('data-id');

		if (surveyId) {
			// Get survey object from API
			$.get( "/ajax/surveys/" + surveyId, function(survey) {

				// Set survey
				this.survey = survey;

				// Initialise editor components once loaded
				this.initComponents();
				
			}.bind(this)).fail(function(error) {
				console.log(error);
			});
			
		} else {
			// Initialise editor components
			this.initComponents();
		}
		
	}
	
	this.initComponents = function() {

		// Initialise RelatedChooser component with sections assigned to survey
		new RelatedChooser($('#relatedChooser', this.target), {id: this.survey.id, type: 'Surveys'}, 'Sections');
		
		// Fade out loading icon
		$('.editor-loading', this.target).fadeOut();
	};

	// Initialise editor if present in the DOM
	if (this.target.length) this.init();
	
}