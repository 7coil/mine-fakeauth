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
	it("should fail on invalid login", function (done) {
		endpoints["/authenticate"]({
			"username": "invalid",
			"password": "invalid"
		}, noop, function (error) {
			assert.equal(error, 3);
			done();
		});
	});

	it("should fail on no key login", function (done) {
		endpoints["/authenticate"]({}, noop, function (error) {
			assert.equal(error, 3);
			done();
		});
	});

	it("should fail on null login", function (done) {
		endpoints["/authenticate"]({
			"username": null,
			"password": null
		}, noop, function (error) {
			assert.equal(error, 3);
			done();
		});
	});

	it("should succeed on valid login", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password"
		}, function (result) {
			assert.isObject(result);
			assert.isString(result.accessToken);
			assert.isString(result.clientToken);
			done();
		}, noop);
	});

	it("should keep equal clientToken", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"clientToken": "totallyAToken"
		}, function (result) {
			assert.isString(result.accessToken);
			assert.isString(result.clientToken);
			assert.equal(result.clientToken, "totallyAToken");
			done();
		}, noop);
	});

	it("should keep same accessToken after multiple requests", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"clientToken": "totallyAToken"
		}, function (result) {
			endpoints["/authenticate"]({
				"username": "comp500",
				"password": "password",
				"clientToken": "totallyAToken"
			}, function (result2) {
				assert.equal(result.clientToken, "totallyAToken");
				assert.equal(result2.clientToken, "totallyAToken");
				assert.equal(result.accessToken, result2.accessToken);
				done();
			}, noop);
		}, noop);
	});

	it("should provide profiles if agent provided", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (result) {
			assert.isString(result.accessToken);
			assert.isString(result.clientToken);
			assert.isString(result.selectedProfile.id);
			assert.isString(result.selectedProfile.name);
			assert.deepEqual(result.selectedProfile, result.availableProfiles[0]);
			assert.equal(result.selectedProfile.name, "comp500");
			done();
		}, noop);
	});

	it("should provide user if requested", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"requestUser": true,
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (result) {
			assert.isString(result.accessToken);
			assert.isString(result.clientToken);
			assert.isString(result.selectedProfile.id);
			assert.equal(result.user.id, result.selectedProfile.id);
			assert.equal(result.user.id, result.availableProfiles[0].id);
			done();
		}, noop);
	});
});
