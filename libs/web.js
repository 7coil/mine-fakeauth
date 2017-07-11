const express = require('express');
const bodyParser = require('body-parser');

const errors = require('./errors.json');
const endpoints = require("./endpoints.js");

module.exports = function (options) {
	var database;
	if (options && options.database) {
		database = options.database;
	} else {
		database = require("../databases/dummy.js")
	}
	var endpointsArray = endpoints(database);
	
	const router = express.Router();
	router.use(bodyParser.json());

	Object.keys(endpointsArray).forEach(function (key) {
		router.post(key, function (req, res) {
			endpointsArray[key](req.body, function endpointHandler(response, status) {
				if (status) {
					res.status(status);
				}
				if (response) {
					res.end(JSON.stringify(response));
				} else {
					res.status(204);
					res.end(); // no content
				}
			}, function errorHandler(error) {
				res.status(errors[error].errorCode);
				res.end(JSON.stringify(errors[error]));
			});
		});
	});

	router.use(function(req, res, next) {
		if (req.method != "POST") { // differing from reference implementation as 404 returned before 405 normally
			res.status(errors[0].errorCode);
			res.end(JSON.stringify(errors[0]));
		} else {
			res.status(errors[1].errorCode);
			res.end(JSON.stringify(errors[1]));
		}
	});

	return router;
};
