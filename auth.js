var uuid = require('uuid-lib');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'tokens.db', autoload: true });

module.exports = {};

module.exports.authenticate(data, callback) {
	db.findOne({
		username: data.username,
		accessToken: {
			$exists: false
		}
	}, (err, doc) => {
		if (err) {
			throw err;
		}
		var clientToken = data.clientToken || uuid.raw();
		var accessToken = uuid.raw();
		var profileID;
		var userID;

		if (doc) {
			profileID = doc.profileID;
			userID = doc.userID;
		} else {
			profileID = uuid.raw();
			userID = uuid.raw();

			db.insert({
				username: data.username
			});
		}

		db.insert({
			username: data.username
		});
	});
}

module.exports.refresh(data, callback) {
	db.findOne({
		accessToken: data.accessToken
	}, (err, doc) => {
		if (err) {
			callback(false);
		}
		if (!doc) {
			callback(false);
		}
		// refresh token, update then callback
	});
}

module.exports.validate(data, callback) {
	db.findOne({
		accessToken: data.accessToken
	}, (err, doc) => {
		if (err) {
			callback(false);
		}
		if (!doc) {
			callback(false);
		} else {
			callback(true);
		}
	});
}

module.exports.checkInvalidate(data, callback) { // TODO: merge with invalidate when I want to do invalidation
	callback(false);
}

module.exports.invalidate(data) {
	db.remove({
		accessToken: data.accessToken
	}, {});
}
