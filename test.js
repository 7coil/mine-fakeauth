var data = require("./databases/dummy.js");
var web = require("./lib/web.js");
var endpoints = require("./lib/endpoints.js");
var webrun = web();

endpoints(webrun, data);
