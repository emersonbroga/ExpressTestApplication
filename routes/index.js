'use strict';
var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var request = require('request');
var config = require('config/config');

/* GET home page. */
router.get('/', function(req, res/*, next*/) {
  res.render('index', { title: 'MelissaData/EmailCheck' });
});


function credentials () {
  var apikey = config.apikey;
  return 'Basic ' + new Buffer('' + ':' + apikey).toString('base64');
}

/* POST home page. */
router.post('/', function(req, res/*, next*/) {

  // build the post_data string from an object
  var post_data = req.body;
  post_data.Email = '\'' + encodeURIComponent(post_data.Email) + '\'';
  post_data.Email = post_data.Email.replace(/'/g, '%27');

  var url = 'https://api.datamarket.azure.com/MelissaData/EmailCheck/v1/SuggestEmails?';
  url += 'Email=' + post_data.Email + '&';
  url += 'MaximumSuggestions=' + post_data.MaximumSuggestions + '&';
  url += 'MinimumConfidence=' + post_data.MinimumConfidence;
  var options = {
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: credentials()
      }
    };
  request.get(options, function (err, response, body) {
    if (err) {
      console.log(err.message);
      res.render('index', { title: 'MelissaData Request Error', error: err.message });
    } else if (response.statusCode !== 200) {
      body = JSON.parse(body);
      console.log(response.statusCode);
      console.log(body.Message);

      res.render('index', { title: 'MelissaData Request Error', error: body.Message });
    }else if (response.statusCode === 200) {
      parseString(body, function (err, obj) {
        if(err){
          console.log(err.message);
          res.render('index', { title: 'MelissaData Request Error', error: err.message });
        }else{

          var result = {
            confidence: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:Confidence'][0]._,
            results: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:Results'][0]._,
            domain: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:Domain'][0]._,
            mailBox: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:MailBox'][0]._,
            topLevelDomain: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:TopLevelDomain'][0]._,
            topLevelDomainDescription: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:TopLevelDomainDescription'][0]._,
            email: obj.feed.entry[0]['content'][0]['m:properties'][0]['d:Email'][0]._
          };
          console.log(result);
          res.render('index', { title: 'MelissaData/EmailCheck Request', result: result });
        }
      });
    }
  });
});

module.exports = router;

