const uuid = require('uuid/v4');

module.exports = function (registerEndpoint, database) {
	registerEndpoint("/authenticate", function (body, send, error) {
		if (!body.clientToken) {
			body.clientToken = uuid(); // generate clientToken if not given
		}
		database.getPlayer(body.username, body.password).then(function (player) {
			var accessToken = database.getAccessToken(body.clientToken);
			if (!accessToken) {
				accessToken = uuid(); // generate new accessToken if not given
				database.setAccessToken(body.clientToken, accessToken);
			}

			var reply = {
				accessToken: accessToken,
				clientToken: body.clientToken,
			};

			if (body.agent) {
				reply.availableProfiles = [
					{
						"id": player.profileID,
						"name": body.username
					}
				];
				reply.selectedProfile = {
					"id": player.profileID,
					"name": body.username
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
	});
};
