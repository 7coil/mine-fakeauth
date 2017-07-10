const assert = require("chai").assert;
const noop = function (reason) {
	throw new Error(reason); // throw error when wrong callback is called
};

var data = require("../databases/dummy.js");
var web = require("../libs/web.js");
var endpoints = require("../libs/endpoints.js");
var fs = require("fs");

var webrun = web();
endpoints(webrun, data);

var ygg = require("yggdrasil")({
	host: "http://localhost"
});

describe("ygg-auth", function () {
	it("works", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err, data) {
			if (err) {
				done(err);
			}
			if (data) {
				done();
			}
		});
	});

	it("fails on bad password", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "incorrect"
		}, function (err, data) {
			if (err) {
				done();
			} else {
				done("No error!")
			}
		});
	});

	it("fails on bad username", function (done) {
		ygg.auth({
			user: "invalid",
			pass: "invalid"
		}, function (err, data) {
			if (err) {
				done();
			} else {
				done("No error!")
			}
		});
	});

	it("fails on no user/pass", function (done) {
		ygg.auth({}, function (err, data) {
			if (err) {
				done();
			} else {
				done("No error!")
			}
		});
	});
});

describe("ygg-refresh", function () {
	it("works", function (done) {
		done();
	});
});

describe("ygg-validate", function () {
	it("works", function (done) {
		done();
	});
});

describe("ygg-signout", function () {
	it("works", function (done) {
		done();
	});
});
