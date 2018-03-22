# status-codes

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]

Small module to return all known HTTP status with a name and brief description.

## Installation

```bash
$ npm install status-codes --save
```
## Using

All codes from this [Wiki HTTP Status Codes](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

```javascript
    
    var statusCodes = require('status-codes');

	statusCodes[404];
		
	/** 
	
	Returns:
	
	{
		"status": 404,
		"name": "Not Found",
		"message": "The server has not found anything matching the Request-URI."
	}
	
	**/
	
	// OR use a get method that has a fallback to a code 400 if it doesn't find a valid code
	
	statusCodes.get(536727);
	
	/** 
	
	Returns:
	
	{
		"status": 400,
		"name": "Bad Request",
		"message": "The server cannot or will not process the request."
	}
	
	**/

```

## Constants

Can retrive HTTP status by name too:

```javascript

	statusCodes.NOT_FOUND;
		
	/** 
	
	Returns:
	
	{
		"status": 404,
		"name": "Not Found",
		"message": "The server has not found anything matching the Request-URI."
	}
	
	**/

```

[npm-image]: https://img.shields.io/npm/v/status-codes.svg?style=flat
[npm-url]: https://npmjs.org/package/status-codes
[downloads-image]: https://img.shields.io/npm/dm/status-codes.svg?style=flat
[downloads-url]: https://npmjs.org/package/status-codes
[travis-image]: https://img.shields.io/travis/strongloop/status-codes.svg?style=flat
[travis-url]: https://travis-ci.org/strongloop/status-codes
[coveralls-image]: https://img.shields.io/coveralls/strongloop/status-codes?style=flat
[coveralls-url]: https://coveralls.io/r/strongloop/status-codes?branch=master
