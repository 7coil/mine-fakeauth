var uuid = require('uuid-lib');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'tokens', autoload: true });

module.exports = {};

module.exports.authenticate(data, callback) {
	var clientToken = data.clientToken || uuid.raw();
	var accessToken = uuid.raw();
	var profileID = uuid.raw();
	var userID = uuid.raw();

	db.insert({
		username: data.username,
		clientToken: clientToken
	});
}

module.exports.checkRefresh(data, callback) {

}

module.exports.refresh(data, callback) {

}

module.exports.validate(data, callback) {

}

module.exports.checkInvalidate(data, callback) {

}

module.exports.invalidate(data) {
	db.remove({
		clientToken: data.clientToken,
		accessToken: data.accessToken
	}, {});
}
