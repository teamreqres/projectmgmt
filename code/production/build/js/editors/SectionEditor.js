/*
 * reqRes
 * Survey Builder
 * 
 * SectionEditor.js
 * - Handles display and functionality of the Section Editor
 */


function SectionEditor(target) {

	this.section = {};
	this.target = $(target);

	this.init = function() {

		// Get section id from editor element
		var sectionId = $(target).attr('data-id');

		if (sectionId) {
			// Get section object from API
			$.get( "/ajax/sections/" + sectionId, function(section) {

				// Set section
				this.section = section;

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

		// Initialise AssignedItems component with surveys assigned to section
		new AssignedItems($('#assignedItems', this.target), {id: this.section.id, type: 'Sections'}, 'Surveys');

		// Initialise RelatedChooser component with questions assigned to section
		new RelatedChooser($('#relatedChooser', this.target), {id: this.section.id, type: 'Sections'}, 'Questions');
		
		// Fade out loading icon
		$('.editor-loading', this.target).fadeOut();
	};

	// Initialise editor if present in the DOM
	if (this.target.length) this.init();
	
}