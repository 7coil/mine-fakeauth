var uuid = require('uuid-lib');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'tokens', autoload: true });

module.exports = {};

module.exports.authenticate(data) {

}

module.exports.checkRefresh(data) {

}

module.exports.refresh(data) {

}

module.exports.validate(data) {

}

module.exports.checkInvalidate(data) {

}

module.exports.invalidate(data) {

}
