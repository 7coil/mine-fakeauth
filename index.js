var express = require('express');
var https = require('https');
var fs = require('fs');
var morgan = require('morgan');
var requestProxy = require('express-request-proxy');

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.cert')
};

// Create a service (the app object is just a callback).
var app = express();

app.use(morgan('combined'));

app.all("/*", requestProxy({
	url: "https://authserver.mojang.com/*"
}));

// Create an HTTPS service
https.createServer(options, app).listen(443);
