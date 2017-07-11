const assert = require("chai").assert;
const noop = function (reason) {
	throw new Error(reason); // throw error when wrong callback is called
};

var web = require("../libs/web.js");
var app = require("express")();
var morgan = require("morgan");

app.use(morgan(":method :url :status :response-time ms"));
app.use(web());
app.listen(8080);

var ygg = require("yggdrasil")({
	host: "http://localhost:8080"
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
				assert.isString(data.clientToken);
				assert.isString(data.accessToken);
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
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err1, auth) {
			if (err1) {
				done(err1);
			} else {
				ygg.refresh(auth.accessToken, auth.clientToken, function (err2, accessToken) {
					if (err2) {
						done(err2);
					} else {
						assert.isString(accessToken);
						assert.notEqual(accessToken, auth.accessToken);
						done();
					}
				});
			}
		});
	});

	it("works multiple times", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err1, auth) {
			if (err1) {
				done(err1);
			} else {
				ygg.refresh(auth.accessToken, auth.clientToken, function (err2, data) {
					if (err2) {
						done(err2);
					} else {
						ygg.refresh(data, auth.clientToken, function (err3, data) {
							if (err3) {
								done(err3);
							} else {
								done();
							}
						});
					}
				});
			}
		});
	});

	it("only works once with same token", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err1, auth) {
			if (err1) {
				done(err1);
			} else {
				ygg.refresh(auth.accessToken, auth.clientToken, function (err2, data) {
					if (err2) {
						done(err2);
					} else {
						ygg.refresh(auth.accessToken, auth.clientToken, function (err3, data) {
							if (err3) {
								done();
							} else {
								done("No error!");
							}
						});
					}
				});
			}
		});
	});
});

describe("ygg-validate", function () {
	it("works", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err1, auth) {
			if (err1) {
				done(err1);
			} else {
				ygg.validate(auth.accessToken, function (err2) {
					if (err2) {
						done(err2);
					} else {
						done();
					}
				});
			}
		});
	});

	it("fails on error", function (done) {
		ygg.validate("invalid", function (err2) {
			if (err2) {
				done();
			} else {
				done("No error!");
			}
		});
	});
});

describe("ygg-signout", function () {
	it("works", function (done) {
		ygg.auth({
			user: "comp500",
			pass: "password"
		}, function (err1, auth) {
			if (err1) {
				done(err1);
			} else {
				ygg.signout("comp500", "password", function (err2) {
					if (err2) {
						done(err2);
					} else {
						ygg.validate(auth.accessToken, function (err3) {
							if (err3) {
								done();
							} else {
								done("No error!");
							}
						});
					}
				});
			}
		});
	});

	it("fails on error", function (done) {
		ygg.signout("comp500", "invalid", function (err2) {
			if (err2) {
				done();
			} else {
				done("No error!");
			}
		});
	});
});
