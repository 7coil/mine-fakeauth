var data = require("./databases/dummy.js");
var web = require("./libs/web.js");
var endpoints = require("./libs/endpoints.js");
var webrun = web();

endpoints(webrun, data);
