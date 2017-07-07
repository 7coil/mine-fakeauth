const uuid = require('uuid/v4');

var playerDatabase = [
	{
		username: "comp500",
		password: "password",
		profileID: uuid()
	}
];
var tokenDatabase = [];

module.exports = {};

module.exports.getPlayerFromLogin = function (username, password) {
	return new Promise(function (resolve, reject) {
		var player = playerDatabase.find(function (element) {
			return username == element.username;
		});
		if (player) {
			if (player.password == password) {
				resolve(player);
			} else {
				reject();
			}
		} else {
			reject();
		}
	});
};

module.exports.getPlayerFromToken = function (accessToken) {
	return new Promise(function (resolve, reject) {

	});
};

module.exports.getAccessToken = function (clientToken) {

};

module.exports.setAccessToken = function (clientToken) {
	return new Promise(function (resolve, reject) {

	});
};

module.exports.deleteTokensFromUser = function (username) {
	return new Promise(function (resolve, reject) {

	});
};

module.exports.deleteTokenFromToken = function (accessToken) {
	return new Promise(function (resolve, reject) {

	});
};
