var web = require("./libs/web.js");
var fs = require("fs");
var app = require("express")();
var https = require("https");
var morgan = require("morgan");

app.use(morgan("combined"));
app.use(web());

var server = https.createServer({
	key: fs.readFileSync('./keys/key.key'),
	cert: fs.readFileSync('./keys/cert.crt')
}, app);

server.listen(443);
