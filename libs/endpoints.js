const uuid = require('uuid/v4');

module.exports = function (database) {
	return {
		"/authenticate": function (body, send, error) {
			if (!body.clientToken) {
				body.clientToken = uuid(); // generate clientToken if not given
			}
			database.getPlayerFromLogin(body.username, body.password).then(function (player) {
				var accessToken = database.getAccessToken(body.clientToken);
				if (!accessToken) {
					accessToken = uuid(); // generate new accessToken if not given
					database.setAccessToken(body.clientToken, accessToken, body.username);
				}

				var reply = {
					accessToken: accessToken,
					clientToken: body.clientToken
				};

				if (body.agent) {
					reply.availableProfiles = [
						{
							"id": player.profileID,
							"name": player.username
						}
					];
					reply.selectedProfile = {
						"id": player.profileID,
						"name": player.username
					};
				}

				if (body.requestUser) {
					reply.user = {
						"id": player.profileID
					};
				}

				send(reply);
			}).catch(function () {
				error(3); // Invalid username or password
			});
		},
		"/refresh": function (body, send, error) {
			if (!body.clientToken) {
				error(5);
				return;
			}
			database.getPlayerFromToken(body.accessToken, body.clientToken).then(function (player) {
				var newToken = uuid(); // generate new token
				database.setAccessToken(body.clientToken, newToken, player.username);

				var reply = {
					accessToken: newToken,
					clientToken: body.clientToken,
					selectedProfile: {
						"id": player.profileID,
						"name": player.username
					}
				};

				if (body.requestUser) {
					reply.user = {
						"id": player.profileID
					};
				}

				send(reply);
			}).catch(function () {
				error(5); // Invalid token
			});
		},
		"/validate": function (body, send, error) {
			database.getPlayerFromToken(body.accessToken, body.clientToken).then(function (player) {
				send(); // 204 No Content
			}).catch(function () {
				error(5); // Invalid token
			});
		},
		"/signout": function (body, send, error) {
			database.getPlayerFromLogin(body.username, body.password).then(function (player) {
				database.deleteTokensFromUser(body.username).then(function () {
					send(); // 204 No Content
				});
			}).catch(function () {
				error(3); // Invalid username or password
			});
		},
		"/invalidate": function (body, send, error) { // todo check client token?
			database.deleteTokenFromToken(body.accessToken).then(function () {
				send(); // 204 No Content
			}).catch(function () {
				error(5); // Invalid token
			});
		}
	};
};
