var uuid = require('uuid-lib');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'tokens', autoload: true });

module.exports = {};

module.exports.authenticate(data, callback) {
	db.findOne({ username: data.username });
	var clientToken = data.clientToken || uuid.raw();
	var accessToken = uuid.raw();
	var profileID = uuid.raw();
	var userID = uuid.raw();

	db.insert({
		username: data.username
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

}

module.exports.checkInvalidate(data, callback) {
	callback(false);
}

module.exports.invalidate(data) {
	db.remove({
		accessToken: data.accessToken
	}, {});
}
