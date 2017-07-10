const assert = require("chai").assert;
const endpointsFile = require("../libs/endpoints.js");
const noop = function (reason) {
	throw new Error(reason); // throw error when wrong callback is called
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
			assert.equal(error, 3); // todo change error to 7?
			done();
		});
	});

	it("should fail on null login", function (done) {
		endpoints["/authenticate"]({
			"username": null,
			"password": null
		}, noop, function (error) {
			assert.equal(error, 3); // todo change error to 7?
			done();
		});
	});

	it("should fail on login with bad password", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "invalid"
		}, noop, function (error) {
			assert.equal(error, 3); // todo change error to 7?
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

describe("refresh", function () {
	it("should fail on invalid tokens", function (done) {
		endpoints["/refresh"]({
			"accessToken": "invalid",
			"clientToken": "invalid"
		}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should fail on no tokens", function (done) {
		endpoints["/refresh"]({}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should fail on null tokens", function (done) {
		endpoints["/refresh"]({
			"accessToken": null,
			"clientToken": null
		}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should succeed on valid tokens", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/refresh"]({
				"accessToken": auth.accessToken,
				"clientToken": auth.clientToken
			}, function (result) {
				assert.isObject(result);
				assert.isString(result.accessToken);
				assert.isString(result.clientToken);
				assert.notEqual(result.accessToken, auth.accessToken);
				assert.equal(result.clientToken, auth.clientToken);
				assert.deepEqual(result.selectedProfile, auth.selectedProfile);
				done();
			}, noop);
		}, noop);
	});

	it("should fail on incorrect client token", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/refresh"]({
				"accessToken": auth.accessToken,
				"clientToken": "invalid"
			}, noop, function (error) {
				assert.equal(error, 5);
				done();
			});
		}, noop);
	});

	it("should provide user if requested", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"requestUser": true
		}, function (auth) {
			endpoints["/refresh"]({
				"accessToken": auth.accessToken,
				"clientToken": auth.clientToken,
				"requestUser": true
			}, function (result) {
				assert.deepEqual(result.user, auth.user);
				done();
			}, noop);
		}, noop);
	});

	it("should invalidate old token and new token is valid", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password"
		}, function (auth) {
			endpoints["/refresh"]({
				"accessToken": auth.accessToken,
				"clientToken": auth.clientToken
			}, function (result) {
				assert.notEqual(result.accessToken, auth.accessToken);
				endpoints["/validate"]({ // test old is invalid
					"accessToken": auth.accessToken,
					"clientToken": auth.clientToken
				}, noop, function (error) {
					assert.equal(error, 5);
					endpoints["/validate"]({ // ensure new is valid
						"accessToken": result.accessToken,
						"clientToken": auth.clientToken
					}, done, noop);
				});
			}, noop);
		}, noop);
	});
});

describe("validate", function () {
	it("should fail on invalid tokens", function (done) {
		endpoints["/validate"]({
			"accessToken": "invalid",
			"clientToken": "invalid"
		}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should fail on no tokens", function (done) {
		endpoints["/validate"]({}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should fail on null tokens", function (done) {
		endpoints["/validate"]({
			"accessToken": null,
			"clientToken": null
		}, noop, function (error) {
			assert.equal(error, 5);
			done();
		});
	});

	it("should succeed on valid tokens", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/validate"]({
				"accessToken": auth.accessToken,
				"clientToken": auth.clientToken
			}, done, noop);
		}, noop);
	});

	it("should fail on incorrect client token", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/validate"]({
				"accessToken": auth.accessToken,
				"clientToken": "invalid"
			}, noop, function (error) {
				assert.equal(error, 5);
				done();
			});
		}, noop);
	});

	it("should succeed on null client token", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/validate"]({
				"accessToken": auth.accessToken,
				"clientToken": null
			}, done, noop);
		}, noop);
	});
});

describe("signout", function () {
	it("should fail on invalid login", function (done) {
		endpoints["/signout"]({
			"username": "invalid",
			"password": "invalid"
		}, noop, function (error) {
			assert.equal(error, 3);
			done();
		});
	});

	it("should fail on no login", function (done) {
		endpoints["/signout"]({}, noop, function (error) {
			assert.equal(error, 3); // todo change error to 7?
			done();
		});
	});

	it("should fail on null login", function (done) {
		endpoints["/signout"]({
			"username": null,
			"password": null
		}, noop, function (error) {
			assert.equal(error, 3); // todo change error to 7?
			done();
		});
	});

	it("should fail on login with bad password", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/signout"]({
				"username": "comp500",
				"password": "invalid"
			}, noop, function (error) {
				assert.equal(error, 3);
				done();
			});
		}, noop);
	});

	it("should succeed on valid login", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/signout"]({
				"username": "comp500",
				"password": "password"
			}, done, noop);
		}, noop);
	});

	it("should remove user after valid login", function (done) {
		endpoints["/authenticate"]({
			"username": "comp500",
			"password": "password",
			"agent": {
				"name": "Minecraft",
				"version": 1
			}
		}, function (auth) {
			endpoints["/signout"]({
				"username": "comp500",
				"password": "password"
			}, function () {
				endpoints["/validate"]({
					"accessToken": auth.accessToken,
					"clientToken": auth.clientToken
				}, noop, function (error) {
					assert.equal(error, 5);
					done();
				});
			}, noop);
		}, noop);
	});
});
