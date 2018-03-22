'use strict'
const BaseModel = require('./Base');

/**
 * SectionModel module.
 * @module SectionModel
 */

/**
 * Class representing a section model.
 * @extends BaseModel
 */
class SectionModel extends BaseModel {
	
	/**
	 * Get all sections
	 * @return {Request} Request Promise
	 */
	getAll() {
		return this.sendRequest('get', '/surveySections', false, this.formatCallback.bind(this));
	}

	/**
	 * Get single section
	 * @param {string} sectionId - ID of Section to get
	 * @return {Request} Request Promise
	 */
	get(sectionId) {
		return this.sendRequest('get', '/surveySections/' + sectionId, false, this.formatCallback.bind(this));
	}

	/**
	 * Get all sections that have the supplied question assigned
	 * @param {string} questionId - ID of Question to find related sections
	 * @return {Request} Request Promise
	 */
	getAllByAssignedQuestion(questionId) {
		return this.sendRequest('get', '/surveySections/?questionIds=' + questionId, false, this.formatCallback.bind(this));
	}

	/**
	 * Create new section
	 * @param {string} sectionBody - Body of Section to create
	 * @return {Request} Request Promise
	 */
	create(sectionBody) {
		return this.sendRequest('post', '/surveySections', sectionBody );
	}

	/**
	 * Update existing section
	 * @param {string} sectionId - ID of Section to get
	 * @param {string} sectionBody - Body of Section to create
	 * @return {Request} Request Promise
	 */
	update(sectionId, sectionBody) {
		return this.sendRequest('put', '/surveySections/' + sectionId, sectionBody );
	}

	/**
	 * Delete section
	 * @param {string} sectionId - ID of Section to get
	 * @return {Request} Request Promise
	 */
	delete(sectionId) {
		return this.sendRequest('delete', '/surveySections/' + sectionId );
	}

	/**
	 * Request Callback function to format response body
	 * @param {string} body - Response Body
	 * @return {object} Single or array of formatted sections
	 */
	formatCallback(body) {
		return this.format(body);
	}

	/**
	 * Format data to section format
	 * @param {object} data - Incoming data
	 * @return {object} Single or array of formatted sections
	 */
	format(data) {

		/**
		 * Format raw section into correct format
		 * @param {object} section - Single section
		 * @return {object} Single formatted section
		 */
		var formatSingle = function(section) {
			return {
				id: section.id,
				name: section.heading,
				introductionMessage: section.introductionMessage,
				questionIds: section.questionIds
			}
		}

		// Call base function
		return super.format(data, formatSingle);
		
	}

}

/** Export Module */
module.exports = SectionModel;