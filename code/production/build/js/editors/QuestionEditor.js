/*
 * reqRes
 * Survey Builder
 * 
 * QuestionEditor.js
 * - Handles display and functionality of the Question Editor
 */


function QuestionEditor(target) {

	this.question = {};
	this.target = $(target);
	this.questionTypes = $('#questionType', this.target);
	this.questionChoices = $('#questionChoices', this.target);

	this.init = function() {

		// Get question id from editor element
		var questionId = $(target).attr('data-id');

		if (questionId) {
			// Get question object from API
			$.get( "/ajax/questions/" + questionId, function(question) {

				// Set question
				this.question = question;

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
		// Initialise question choices
		this.initQuestionChoices();
		
		// Initialise question Types
		this.initQuestionTypes();

		// Initialise AssignedItems component with sections assigned to question
		new AssignedItems($('#assignedItems', this.target), {id: this.question.id, type: 'Questions'}, 'Sections');
		
		// Fade out loading icon
		$('.editor-loading', this.target).fadeOut();
	};

	this.initQuestionTypes = function() {
		// Get question types from API
		$.get( "/ajax/questionTypes/", function(types) {

			// Append types to question type dropdown
			for (var i = 0; i < types.length; i++) {
				
				// If current question type matches current question
				if (this.question && this.question.questionType == types[i].questionType) {
					this.questionTypes.append('<option selected>' + types[i].questionType + '</option>');
				} else {
					this.questionTypes.append('<option>' + types[i].questionType + '</option>');
				}
				
			}

			// Perform initial question type check
			this.toggleQuestionChoices();

			// When question type option changes
			this.questionTypes.change( function() {
				this.toggleQuestionChoices();
			}.bind(this));

		}.bind(this)).fail(function(error) {
			console.log(error);
		});
	}

	this.toggleQuestionChoices = function() {
		// Get selected option
		var option = this.questionTypes.val();
	
		if (option.toLowerCase().indexOf("select") >= 0) {
			this.questionChoices.slideDown();
		} else {
			this.questionChoices.slideUp();
		}
	}

	this.initQuestionChoices = function() {

		// Hide question choices component
		$(this.questionChoices).hide();

		// Empty question choices
		$("#questionChoicesContainer", this.questionChoices).empty();

		// If questionId provided
		if (this.question) {
			// Get question choices from API
			$.get( "/ajax/questions/" + this.question.id, function(question) {
				
				// Get choices from question model
				var choices = question.questionChoices;

				// Render question choices
				for (var i = 0; i < choices.length; i++) {
					this.createQuestionChoice(choices[i]);
				}

			}.bind(this)).fail(function(error) {
				console.log(error);
			});

		}

		// Add Create Event Handler
		$('button[data-create]', this.questionChoices).click( function() {
			// Create blank question choice
			this.createQuestionChoice();
		}.bind(this));
		
		// Initialise sortable effect
		$( "#questionChoicesContainer" ).sortable();

	}

	this.createQuestionChoice = function(value) {

		if (!value) {
			var value = '';
		}

		// Set choice html
		var html = '<div class="input-group mb-2">';
				html += '<div class="input-group-prepend">';
				html += '<span class="input-group-text"><i class="fa fa-arrows" aria-hidden="true"></i> <span class="sr-only">Drag</span></span>';
				html += '</div>';
				html += '<input type="text" name="questionChoices[]" class="form-control" value="' + value + '">';
				html += '<div class="input-group-append">';
				html += '</div>';
				html += '</div>';

		// Construct element
		var choice = $(html);

		// Create delete button
		var deleteButton = $('<button class="btn btn-danger" type="button"><i class="fa fa-trash" aria-hidden="true"></i> <span class="sr-only">Delete</span></button>');

		// Append button to choice
		$('.input-group-append', choice).append(deleteButton);

		// Set delete click handler
		deleteButton.click(function () {
			$(choice).remove();
		})
		
		// Append question choice to component
		$("#questionChoicesContainer", this.questionChoices).append(choice);
	}


	// Initialise editor if present in the DOM
	if (this.target.length) this.init();
	
}