/*
 * reqRes
 * Survey Builder
 * 
 * AssignedItems.js
 * - Handles display of items that current item is assigned to
 */

function AssignedItems(target, current, assignedType) {

	this.target = $(target);
	this.current = current;
	this.assignedType = assignedType;

	this.init = function() {

		// Get question types from API
		$.get( "/ajax/" + this.current.type + "/" + this.current.id + "/assignedTo", function(assigned) {

			// Append types question type dropdown
			for (var i = 0; i < assigned.length; i++) {
				this.target.find('ul.list-group').append( this.returnHTML(assigned[i].id, assigned[i].name) );
			}

			// Fade out loading icon
			$('.assigned-loading', this.target).fadeOut(400, function() {
				// Slide down assigned items
				$('.card', this.target).slideDown();
			}.bind(this));

		}.bind(this)).fail(function(error) {
			console.log(error);
		})

	}

	this.returnHTML = function(id, name) {
		var html = '<li>';
				html += '<a href="/' + this.assignedType.toLowerCase() + '/' + id + '" class="list-group-item list-group-item-action flex-column align-items-start">';
				html += '<span class="badge badge-secondary">' + this.assignedType + '</span>';
				html += '<br>' + name + '';
				html += '</a>';
				html += '</li>';
		
		return html;
	}

	// Initialise editor if present in the DOM
	if (this.target.length) this.init();

 }