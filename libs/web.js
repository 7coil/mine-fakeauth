const express = require('express');
const https = require('https');

const morgan = require('morgan');
const bodyParser = require('body-parser');

const errors = require('./errors.json');

module.exports = function () {
	const app = express();
	const router = express.Router();
	
	app.use(morgan("combined"));
	app.use(bodyParser.json());

	app.use(router);
	
	app.use(function(req, res, next) {
		if (req.method != "POST") { // differing from reference implementation as 404 returned before 405 normally
			res.status(405);
			res.end(JSON.stringify(errors[1]));
		} else {
			res.status(404);
			res.end(JSON.stringify(errors[2]));
		}
	});
	
	http.createServer(app).listen(443);
	
	return function (endpoint, callback) {
		router.post(endpoint, function (req, res) {
			callback(req.body, function endpointHandler(response, status) {
				if (status) {
					res.status(status);
				}
				res.end(JSON.stringify(response));
			}, function errorHandler(error) {
				red.status(500); // TODO set error status code
				res.end(JSON.stringify(errors[error]));
			});
		});
	};
};
