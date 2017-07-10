const assert = require("chai").assert;
const endpointsFile = require("../libs/endpoints.js");
const noop = function () {
	throw new Error(); // throw error when wrong callback is called
};
var endpoints = {};

// let mocha handle rejections
process.on('unhandledRejection', function (reason) {
    throw reason;
});

// import all endpoint functions to endpoints
endpointsFile(function (url, callback) {
	endpoints[url] = callback;
}, require("../databases/dummy.js"));

describe("authenticate", function () {
	it("should fail on invalid login", function () {
		return new Promise(function (resolve) {
			endpoints["/authenticate"]({
				"username": "invalid",
				"password": "invalid"
			}, noop, function (error) {
				assert.equal(error, 3);
				resolve();
			});
		});
	});

	it("should succeed on valid login", function () {
		return new Promise(function (resolve) {
			endpoints["/authenticate"]({
				"username": "comp500",
				"password": "password"
			}, function (result) {
				assert.isObject(result);
				assert.isString(result.accessToken);
				assert.isString(result.clientToken);
				resolve();
			}, noop);
		});
	});

	it("should provide profiles if agent provided", function () {
		return new Promise(function (resolve) {
			endpoints["/authenticate"]({
				"username": "comp500",
				"password": "password",
				"agent": {
					"name": "Minecraft",
					"version": 1
				}
			}, function (result) {
				throw new Error();
				assert.containsAllKeys(result.selectedProfile, ["id", "name"]);
				assert.containsAllKeys(result.availableProfiles[0], ["id", "name"]);
				//assert.equal(result.selectedProfile, result.availableProfiles[0]);
				resolve();
			}, noop);
		});
	});
});
