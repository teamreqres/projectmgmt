/*
 * reqRes
 * Survey Builder
 * 
 * RelatedChooser.js
 * - Handles display and manipulation of question choices
 */

 function RelatedChooser(target, current, relatedType) {

	this.target = $(target);
	this.current = current;
	this.related = relatedType;

	this.init = function() {
		
		// Initialise chooser form
		this.initChooserForm();

		// Hide related items until fully loaded
		$('#relatedContainer', this.target).hide();

		//Initialise sortable effect
		$('#relatedContainer', this.target).sortable();
		
		// Get initial related items from API
		$.get( "/ajax/" + this.current.type.toLowerCase() + "/" + this.current.id + "/" + this.related.toLowerCase(), function(related) {
			
			// Render related items
			for (var i = 0; i < related.length; i++) {
				$('#relatedContainer', this.target).append( this.returnHTML(related[i].id, related[i].name) );
			}
			
			// Fade out loading icon
			$('.related-loading', this.target).fadeOut(400, function() {
				// Slide down related items
				$('#relatedContainer', this.target).slideDown();
			}.bind(this));

		}.bind(this)).fail(function(error) {
			console.log(error);
		});	

		// Hide existing choice selector until fully loaded
		$('#existingChoice', this.target).hide();
		// Empty existing choice selector
		this.target.find('#existingChoice').empty();

		// Get all related choices for selector from API
		$.get( "/ajax/" + this.related.toLowerCase(), function(choices) {

			// Add dropdown placeholder
			this.target.find('#existingChoice').append('<option selected disabled>- Select a ' + this.related.toLowerCase() + '-</option>');

			// Append choices to existing choice selector
			for (var i = 0; i < choices.length; i++) {
				this.target.find('#existingChoice').append('<option value=' + choices[i].id + '>' + choices[i].name + '</option>');
			}

			// Fade out loading icon
			$('.existing-choice-loading', this.target).fadeOut(400, function() {
				// Slide down existing choice chooser
				$('#existingChoice', this.target).slideDown();
			}.bind(this));

		}.bind(this)).fail(function(error) {
			console.log(error);
		});
	
	}

	this.initChooserForm = function() {

		// Hide Add Related Form
		$('#addRelatedForm', this.target).hide();

		// Add Question Button Event handler
		$('button#addRelated', this.target).click( function() {
			$('#addRelatedForm', this.target).slideToggle("slow");
		});

	}

	this.returnHTML = function(id, name) {
		var html = '<div data-id="' + id + '" class="card mb-3">';
				html += '<div class="card-header pr-0 py-0 d-flex align-items-center"><i class="fa fa-arrows" aria-hidden="true"></i>&nbsp;';
				html += name;
				html += '<div class="ml-auto">';
				html += '<button class="btn btn-link text-danger mr-1" type="submit" name="removeRelated" value="' + id + '"><i class="fa fa-minus-circle" aria-hidden="true"></i> Remove</button>';
				html += '<a href="/' + this.related.toLowerCase() + '/' + id + '" class="btn btn-primary"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</a>';
				html += '</div>';
				html += '</div>';
				html += '<input type="hidden" name="' + this.related.toLowerCase() + '[]" value="' + id + '">';
				html += '</div>';

		return html;
	};

	if (this.target.length) this.init();

}