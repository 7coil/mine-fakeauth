module.exports = function (registerEndpoint) {
	registerEndpoint("/authenticate", function (body, send, error) {
		send({"test": "hi!"});
	});
};
