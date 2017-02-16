var uuid = require('uuid-lib');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'tokens.db', autoload: true });

module.exports = {};

module.exports.authenticate = function(data, callback) {
	db.findOne({
		username: data.username,
		accessToken: {
			$exists: false
		},
		profileID: {
			$exists: true
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
				username: data.username,
				profileID: profileID,
				userID: userID
			});
		}

		db.insert({
			username: data.username,
			accessToken: accessToken
		});

		callback({
			"accessToken": accessToken,
			"clientToken": clientToken,
			"availableProfiles": [
				{
					"id": profileID,
					"name": data.username
				}
			],
			"selectedProfile": {
				"id": profileID,
				"name": data.username
			},
			"user": {
				"id": userID
			}
		});
	});
}

module.exports.refresh = function(data, callback) {
	db.findOne({
		accessToken: data.accessToken
	}, (err, doc) => {
		if (err) {
			callback(false);
			return;
		}
		if (!doc) {
			callback(false);
			return;
		}
		// refresh token, update then callback
		var clientToken = data.clientToken;
		var accessToken = uuid.raw();
		var profileID;
		var userID;
		var username = doc.username;

		db.findOne({
			username: username,
			accessToken: {
				$exists: false
			},
			profileID: {
				$exists: true
			}
		}, (err, doc) => {
			if (doc) {
				profileID = doc.profileID;
				userID = doc.userID;
			} else {
				profileID = uuid.raw();
				userID = uuid.raw();

				db.insert({
					username: doc.username,
					profileID: profileID,
					userID: userID
				});
			}

			db.update({
				accessToken: data.accessToken
			}, {
				accessToken: accessToken
			});

			callback(true, {
				"accessToken": accessToken,
				"clientToken": clientToken,
				"selectedProfile": {
					"id": profileID,
					"name": doc.username
				},
				"user": {
					"id": userID
				}
			});
		});
	});
}

module.exports.validate = function(data, callback) {
	db.findOne({
		accessToken: data.accessToken
	}, (err, doc) => {
		if (err) {
			callback(false);
			return;
		}
		if (!doc) {
			callback(false);
			return;
		} else {
			callback(true);
			return;
		}
	});
}

module.exports.checkInvalidate = function(data, callback) { // TODO: merge with invalidate when I want to do invalidation
	callback(false);
}

module.exports.invalidate = function(data) {
	db.remove({
		accessToken: data.accessToken
	}, {});
}
