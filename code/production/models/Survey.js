'use strict'
const BaseModel = require('./Base');

/**
 * SurveyModel module.
 * @module SurveyModel
 */

/**
 * Class representing a survey model.
 * @extends BaseModel
 */
class SurveyModel extends BaseModel {
	
	/**
	 * Get all surveys
	 * @return {Request} Request Promise
	 */
	getAll() {
		return this.sendRequest('get', '/surveys', false, this.formatCallback.bind(this));
	}

	/**
	 * Get single survey
	 * @param {string} surveyId - ID of Survey to get
	 * @return {Request} Request Promise
	 */
	get(surveyId) {
		return this.sendRequest('get', '/surveys/' + surveyId, false, this.formatCallback.bind(this));
	}

	/**
	 * Get all surveys that have the supplied section assigned
	 * @param {string} sectionId - ID of Section to find related surveys
	 * @return {Request} Request Promise
	 */
	getAllByAssignedSection(sectionId) {
		return this.sendRequest('get', '/surveys/?sectionIds=' + sectionId, false, this.formatCallback.bind(this));
	}

	/**
	 * Create new survey
	 * @param {string} surveyBody - Body of Survey to create
	 * @return {Request} Request Promise
	 */
	create(surveyBody) {
		return this.sendRequest('post', '/surveys', surveyBody );
	}

	/**
	 * Update existing survey
	 * @param {string} surveyId - ID of Survey to get
	 * @param {string} surveyBody - Body of Survey to create
	 * @return {Request} Request Promise
	 */
	update(surveyId, surveyBody) {
		return this.sendRequest('put', '/surveys/' + surveyId, surveyBody );
	}

	/**
	 * Delete survey
	 * @param {string} surveyId - ID of Survey to get
	 * @return {Request} Request Promise
	 */
	delete(surveyId) {
		return this.sendRequest('delete', '/surveys/' + surveyId );
	}

	/**
	 * Request Callback function to format response body
	 * @param {string} body - Response Body
	 * @return {object} Single or array of formatted surveys
	 */
	formatCallback(body) {
		return this.format(body);
	}

	/**
	 * Format data to survey format
	 * @param {object} data - Incoming data
	 * @return {object} Single or array of formatted surveys
	 */
	format(data) {

		/**
		 * Format raw survey into correct format
		 * @param {object} survey - Single survey
		 * @return {object} Single formatted survey
		 */
		var formatSingle = function(survey) {
			return {
				id: survey.id,
				name: survey.surveyName,
				introductionMessage: survey.introductionMessage,
        completionMessage: survey.completionMessage,
        sectionIds: survey.sectionIds
			}
		}

		// Call base function
		return super.format(data, formatSingle);
		
	}

}

/** Export Module */
module.exports = SurveyModel;