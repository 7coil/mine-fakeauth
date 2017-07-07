const express = require('express');
const https = require('https');

const morgan = require('morgan');
const bodyParser = require('body-parser');

module.exports = function () {
	const app = express();
	const router = express.Router();
	
	app.use(morgan("combined"));
	app.use(bodyParser.json());

	app.use(router);
	
	app.use(function(req, res, next) {
		if (req.method != "POST") { // differing from reference implementation as 404 returned before 405 normally
			res.status(405);
			res.end(JSON.stringify({
				"error": "Method Not Allowed",
				"errorMessage": "The method specified in the request is not allowed for the resource identified by the request URI",
			}));
		} else {
			res.status(404);
			res.end(JSON.stringify({
				"error": "Not Found",
				"errorMessage": "The server has not found anything matching the request URI",
			}));
		}
	});
	
	http.createServer(app).listen(443);
	
	return function (endpoint, callback) {
		router.post(endpoint, function (req, res) {
			callback(req.body, function endpointHandler(status, response) {
				res.end(JSON.stringify(response));
			}, function errorHandler(error) {
				red.status(500); // TODO send/handle errors
			});
		});
	};
};
