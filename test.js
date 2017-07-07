var data = require("./databases/dummy.js");
var web = require("./libs/web.js");
var endpoints = require("./libs/endpoints.js");
var fs = require("fs");

var webrun = web({
	https: {
		key: fs.readFileSync('./keys/key.pem'),
		cert: fs.readFileSync('./keys/cert.pem')
	}
});

endpoints(webrun, data);
