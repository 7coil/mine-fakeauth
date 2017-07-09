const express = require('express');
const https = require('https');
const http = require('http');

const morgan = require('morgan');
const bodyParser = require('body-parser');

const errors = require('./errors.json');

module.exports = function (options) {
	const app = express();
	const router = express.Router();
	
	app.use(morgan("combined"));
	app.use(bodyParser.json());

	app.use(router);

	app.use(function(req, res, next) {
		if (req.method != "POST") { // differing from reference implementation as 404 returned before 405 normally
			res.status(405);
			res.end(JSON.stringify(errors[0]));
		} else {
			res.status(404);
			res.end(JSON.stringify(errors[1]));
		}
	});
	
	if (options.https) {
		https.createServer(options.https, app).listen(443);
	} else {
		http.createServer(app).listen(80); // for testing
	}
	
	return function (endpoint, callback) {
		router.post(endpoint, function (req, res) {
			callback(req.body, function endpointHandler(response, status) {
				if (status) {
					res.status(status);
				}
				if (response) {
					res.end(JSON.stringify(response));
				} else {
					res.status(204);
					res.end(); // no content
				}
			}, function errorHandler(error, status) {
				if (status) {
					res.status(status); // TODO get status codes from file
				}
				res.end(JSON.stringify(errors[error]));
			});
		});
	};
};
