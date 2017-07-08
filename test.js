var data = require("./databases/dummy.js");
var web = require("./libs/web.js");
var endpoints = require("./libs/endpoints.js");
var fs = require("fs");
var router = require("express").Router();

router.get("/com/mojang/authlib/:ver/authlib-:ver.jar", function () {
	res.sendFile("./keys/authlib-1.5.22.jar");
});

var webrun = web({
	https: {
		key: fs.readFileSync('./keys/key.key'),
		cert: fs.readFileSync('./keys/cert.crt')
	},
	extraRouter: router
});

endpoints(webrun, data);
