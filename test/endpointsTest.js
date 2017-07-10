const assert = require("chai").assert;
const endpointsFile = require("../libs/endpoints.js");
const noop = function () {
	throw new Error(); // throw error when wrong callback is called
};
var endpoints = {};

// import all endpoint functions to endpoints
endpointsFile(function (url, callback) {
	endpoints[url] = callback;
}, require("../databases/dummy.js"));

describe("authenticate", function () {
	it("should fail on invalid login", function () {
		endpoints["/authenticate"]({
			"username": "invalid",
			"password": "invalid"
		}, noop, function (error) {
			assert.equal(error, 3);
		});
	});

	it("should succeed on valid login", function () {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password"
		}, function (result) {
			assert.isObject(result);
			assert.isString(result.accessToken);
			assert.isString(result.clientToken);
		}, noop);
	});
});
