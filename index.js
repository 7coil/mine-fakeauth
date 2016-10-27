var express = require('express');
var https = require('https');
var fs = require('fs');
var morgan = require('morgan');
var requestProxy = require('express-request-proxy');
var dns = require('dns');
var authserverIP;

var options = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.cert')
};

// Create a service (the app object is just a callback).
var app = express();

app.use(morgan('combined'));

app.all("/*", requestProxy({
	url: "https://" + authserverIP + "/*",
	headers: {
		"Host": "authserver.mojang.com"
	}
}));

// resolve actual IP of authserver
dns.resolve4('authserver.mojang.com', (err, addresses) => {
  if (err) throw err;
  if (addresses.length > 0) {
	  authserverIP = addresses[0];
  } else {
	  throw "No addresses, no upstream";
  }
});

// Create an HTTPS service
https.createServer(options, app).listen(443);
