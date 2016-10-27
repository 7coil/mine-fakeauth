var express = require('express');
var https = require('https');
var fs = require('fs');
var morgan = require('morgan');
var requestProxy = require('express-request-proxy');
var dns = require('dns');
var bodyParser = require('body-parser');

var authserverIP;

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.cert')
};

// Create a service (the app object is just a callback).
var app = express();

var startServer = function() {
	app.use(morgan('combined'));
	app.use(bodyParser.json());

	app.post("/authenticate", (req, res, next) => {
		if (req.body.username == "comp501") {
			console.log("Hey!");
			res.end("{}");
		} else {
			next();
		}
	});

	// other endpoints: check if seen token before, if yes validate, if no reject

	app.post("/signout", (req, res, next) => {
		if (req.body.username == "comp501") {
			res.status(204);
		} else {
			next();
		}
	});

	app.post("/*", requestProxy({
		url: "https://" + authserverIP + "/*",
		headers: {
			"Host": "authserver.mojang.com"
		}
	}));

	app.get("/", (req, res, next) => {
		res.end("fakeauth here!");
	})

	// Create an HTTPS service
	https.createServer(options, app).listen(443);
}

// resolve actual IP of authserver
dns.resolve4('authserver.mojang.com', (err, addresses) => {
	if (err) throw err;
	if (addresses.length > 0) {
		authserverIP = addresses[0];
		startServer();
	} else {
		throw "No addresses, no upstream";
	}
});
