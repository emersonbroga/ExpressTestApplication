var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var http = require('http');
var config = require('config/config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page. */
router.post('/', function(req, res, next) {
	var username = config.username;
	var apikey = config.apikey;	
	
	// build the post string from an object
	var post_data = querystring.stringify(req.body);
	
	console.log('SENDING REQUEST... ');
	console.log('USERNAME: ' + username);
	console.log('POST_DATA: ' + post_data);

	var post_options = {
    host: 'api.datamarket.azure.com',
    /*path: '/Data.ashx/MelissaData/EmailCheck/v1/SuggestEmails',*/
    path: '/MelissaData/EmailCheck/v1/SuggestEmails',
    port: '443', /* 443*/
    method: 'GET', /* POST */
    auth: username + ':' + apikey,
    headers: {
      	'Content-Type': 'application/x-www-form-urlencoded',
      	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      	'Accept-Encoding': 'gzip, deflate',
      	'Accept-Language': 'en-US,en;q=0.5',
      	'Connection': 'keep-alive',
      	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:35.0) Gecko/20100101 Firefox/35.0',
      	'Content-Length': post_data.length,
      	/*'api-key': apikey,*/
      	/*'Authorization': 'Basic ' + new Buffer(username + ':' + apikey, 'utf8').toString('base64')*/
    	}
	};
	// set up the request
	var post_req = http.request(post_options, function(response) {
		console.log('GOT RESPONSE:');
		console.log('STATUS: ' + response.statusCode);
    	console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log('RESPONSE: ' + chunk);
			res.render('index', { title: 'Express', response: chunk});
		});
	});

	// post the data
	post_req.write(post_data);
	post_req.on('error', function(e) {
		console.log('GOT ERROR:' + e.message);
	  	res.render('index', { title: 'Express', response: e.message});
	});
	post_req.end();

	console.log(post_req);
});

module.exports = router;
