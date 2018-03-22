/*
 * reqRes
 * Survey Builder
 * 
 * Sidebar.js
 * - Handles loading of data into sidebar
 */


function Sidebar(target) {

	this.target = $(target);
	this.dataType = '';
	this.data = [];

	this.init = function () {
		// Get datatype from target
		this.dataType = target.attr('data-type');

		// Load data from AJAX routes
		this.loadData();

		// init search form
		this.initSearchForm();

		// init sort button
		this.initSortButton();

		// init mobile toggle button
		this.initMobileToggle();
	}

	this.loadData = function () {
		// Hide slider items until fully loaded
		$('.sidebar-items', this.target).hide();
		
		// Load data items into sidebar
		$.get( "/ajax/" + this.dataType, function(data) {
				
			this.data = data;
			this.renderItems(this.data);
			
			// Fade out loading icon
			$('.sidebar-loading', this.target).fadeOut(400, function() {
				// Slide down sidebar items
				$('.sidebar-items', this.target).slideDown();
			}.bind(this));

		}.bind(this)).fail(function(error) {
			console.log(error);
		});
	}

	this.initSearchForm = function () {
		var self = this;

		$(this.target).find('input[name=searchName]').keyup(function () {
			var query = this.value;

			if (query) {
				// Search for item name matching query
				var item = self.data.find(function (element) {
					if (element.name.toLowerCase().search(query.toLowerCase()) !== -1)
						return true;
					else
						return false
				});

				if (item)
					self.renderItems([item]);
				else {
					self.emptyItems();
				}
			} else {
				self.renderItems(self.data);
			}

		});
	}

	this.initSortButton = function() {
		var self = this;

		$(this.target).find('button[name=sort]').click(function () {
			// sort by name
			self.data.sort(function(a, b) {
				var	nameA = a.name.toUpperCase(); // ignore upper and lowercase
				var	nameB = b.name.toUpperCase(); // ignore upper and lowercase

				if (nameA < nameB)
					return -1;
				if (nameA > nameB)
					return 1;

				// names must be equal
				return 0;
			});

			self.renderItems(self.data);
			
			// Reverse sort by attr
			if ($(this).attr('data-sortby') == 'desc') {
				self.renderItems(self.data.reverse());
				$(this).attr('data-sortby', 'asc');
			} else {
				self.renderItems(self.data);
				$(this).attr('data-sortby', 'desc');
			}
		});
	}

	this.initMobileToggle = function () {
		$('button[data-toggle=sidebarToggle]').click(function () {
			$(this.target).toggleClass('open')
		}.bind(this));
	}

	
	/**
	 * Iterate though items and append to sidebar
	 * @param {*} data 
	 */
	this.renderItems = function(data) {
		this.emptyItems();
		
		for (var i = 0; i < data.length; i++) {
			var item = this.renderItem( data[i] );
			$(this.target).find('.sidebar-items').append( item );
		}
	}
	
	/**
	 * 
	 * @param {*} item 
	 */
	this.renderItem = function(item) {
		var html = '<a href="/' + this.dataType + '/' + item.id + '" class="list-group-item list-group-item-action flex-column align-items-start">';
		html += '<span class="badge badge-secondary">' + this.dataType.charAt(0).toUpperCase() + this.dataType.slice(1) + '</span>';
    html += '<h5>' + item.name + '</h5>'
		html += '</a>';
		
		return html;
	}

	this.emptyItems = function () {
		$(this.target).find('.sidebar-items').empty();
	}
	
	this.init();

}


$.fn.sidebar = function() {
	if (this.length)
		return new Sidebar(this);
}