'use strict'
const BaseModel = require('./Base');

/**
 * QuestionModel module.
 * @module QuestionModel
 */

/**
 * Class representing a question model.
 * @extends BaseModel
 */
class QuestionModel extends BaseModel {
	
	/**
	 * Get all questions
	 * @return {Request} Request Promise
	 */
	getAll() {
		return this.sendRequest('get', '/questions', false, this.formatCallback.bind(this));
	}

	/**
	 * Get single question
	 * @param {string} questionId - ID of Question to get
	 * @return {Request} Request Promise
	 */
	get(questionId) {
		return this.sendRequest('get', '/questions/' + questionId, false, this.formatCallback.bind(this));
	}

	/**
	 * Create new question
	 * @param {string} questionBody - Body of Question to create
	 * @return {Request} Request Promise
	 */
	create(questionBody) {
		return this.sendRequest('post', '/questions', questionBody );
	}

	/**
	 * Update existing question
	 * @param {string} questionId - ID of Question to get
	 * @param {string} questionBody - Body of Question to create
	 * @return {Request} Request Promise
	 */
	update(questionId, questionBody) {
		return this.sendRequest('put', '/questions/' + questionId, questionBody );
	}

	/**
	 * Delete question
	 * @param {string} questionId - ID of Question to get
	 * @return {Request} Request Promise
	 */
	delete(questionId) {
		return this.sendRequest('delete', '/questions/' + questionId );
	}

	/**
	 * Get all question types
	 * @return {Request} Request Promise
	 */
	getTypes() {
		return this.sendRequest('get', '/questionTypes');
	}

	/**
	 * Request Callback function to format response body
	 * @param {string} body - Response Body
	 * @return {object} Single or array of formatted questions
	 */
	formatCallback(body) {
		return this.format(body);
	}

	/**
	 * Format data to question format
	 * @param {object} data - Incoming data
	 * @return {object} Single or array of formatted questions
	 */
	format(data) {

		/**
		 * Format raw question into correct format
		 * @param {object} question - Single question
		 * @return {object} Single formatted question
		 */
		var formatSingle = function(question) {
			return {
				id: question.id,
				name: question.questionText,
				questionType: question.questionType,
				questionChoices: question.questionChoices
			}
		}

		// Call base function
		return super.format(data, formatSingle);
		
	}

}

/** Export Module */
module.exports = QuestionModel;