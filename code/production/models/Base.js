'use strict'
const Request = require('request-promise');

/**
 * BaseModel module.
 * @module BaseModel
 */

/** 
 * Class representing a Restlet API model.
 * @requires module:request-promise
 * */
class BaseModel {

	/**
	 * Construct a Base API Model.
	 * @param {string} endpoint - Base Restlet API Endpoint
	 * @param {string} [username] - Username for Authentication
	 * @param {string} [password] - Password for Authentication
	 */
	constructor(endpoint, username = '', password = '') {
		this.endpoint = endpoint;
		this.username = username;
		this.password = password;
	}

	/**
	 * Pass authentication details to model
	 * @param {string} username - Username for Authentication
	 * @param {string} [password] - Password for Authentication
	 */
	authenticate(username, password = '') {
		this.username = username;
		this.password = password;
	}

	/**
	 * Send request to Restlet
	 * @param {string} method - HTTP method for request
	 * @param {string} [url] - Path to append to endpoint
	 * @param {string} [json] - JSON to send as body content
	 * @param {string} [transform] - Callback function to transform body
	 * @return {Request} Request Promise
	 */
	sendRequest(method, url = '', json, transform) {

		var options = {
			url: url,
			baseUrl: this.endpoint,
			method: method,
			json: true,
		}

		if (json) {
			options.body = json;
		}

		if (transform) {
			options.transform = transform;
		}

		if (this.username) {
			options.auth = {
				user: this.username,
				pass: this.password
			}
		}

		return Request(options);

	}

	/**
	 * Format data to provided format
	 * @param {object} data - Incoming data
	 * @param {function} format - Callback to format data
	 * @return {object} Single or array of formatted sections
	 */
	format(data, formatCallback) {

		if (data.constructor === Array) {
			var array = [];
			for (var single of data) {
				array.push( formatCallback(single) );
			}
			return array;
		} else {
			return formatCallback(data);
		}
		
	}

}

/** Export Module */
module.exports = BaseModel;