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

module.exports.getPlayerFromToken = function (accessToken, clientToken) {
	return new Promise(function (resolve, reject) {
		var token = tokenDatabase.find(function (element) {
			return accessToken == element.accessToken;
		});
		if (token) {
			if (clientToken) {
				if (token.clientToken != clientToken) {
					reject();
				}
			}

			var player = playerDatabase.find(function (element) {
				return token.username == element.username;
			});
			if (player) {
				resolve(player);
			} else {
				reject(); // this shouldn't happen
			}
		} else {
			reject();
		}
	});
};

module.exports.getAccessToken = function (clientToken) {
	var token = tokenDatabase.find(function (element) {
		return clientToken == element.clientToken;
	});
	if (token) {
		return token.accessToken;
	} else {
		return null;
	}
};

module.exports.setAccessToken = function (clientToken, accessToken, username) {
	return new Promise(function (resolve, reject) {
		var token = tokenDatabase.findIndex(function (element) {
			return clientToken == element.clientToken;
		});
		if (token > -1) {
			tokenDatabase.splice(token, 1);
		}
		tokenDatabase.push({
			clientToken: clientToken,
			accessToken: accessToken,
			username: username
		});
	});
};

module.exports.deleteTokensFromUser = function (username) {
	return new Promise(function (resolve, reject) {
		do {
			var token = tokenDatabase.findIndex(function (element) {
				return username == element.username;
			});
			if (token > -1) {
				tokenDatabase.splice(token, 1);
			}
		} while (token > -1);
		resolve();
	});
};

module.exports.deleteTokenFromToken = function (accessToken) {
	return new Promise(function (resolve, reject) {
		var token = tokenDatabase.findIndex(function (element) {
			return accessToken == element.accessToken;
		});
		if (token > -1) {
			tokenDatabase.splice(token, 1);
		}
		resolve();
	});
};
