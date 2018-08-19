// Reply with two static messages
const express = require('express')
const https = require('https');
const http = require('http')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000
const URL = require('url').URL;
const _ = require('lodash-node/compat');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text

    console.log(req)
    reply(reply_token, msg)
    res.sendStatus(200)
})

app.listen(port)
function reply(reply_token, msg) {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {lwIfAPK5C+0hfoIcSjTjw8IlaMuuVVDlFbiZbUZb1rngt6ZavKw2uTPXsVayF5KRuS8VR6ZjKAnEN7veRIWzDQOQly9LcOhAMN6Z81skFi70mVm2XOtvHfl8K05TqccU8hamC277MAnLh2CwYQ0CBAdB04t89/1O/w1cDnyilFU=}'
    }

    const options = new URL('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+msg+'.BK&apikey=ZIBM6AL9W01TSKZH');
	https.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');

	  var responseString = '';
	  res.on('data', function(data) {
	    responseString += data;
	  });

	  res.on('end', function() {
	    console.log(responseString);
	    let responseObject = JSON.parse(responseString);
	    let result = responseObject["Time Series (Daily)"];
	    let firstElementKey = Object.keys(result)[0];
	    console.log("NOOM: "+JSON.stringify(firstElementKey));
	    console.log("NOOM: "+JSON.stringify(result[firstElementKey]));
	    let response = JSON.stringify(firstElementKey)+"/n"+JSON.stringify(result[firstElementKey]);
	    sendMessage(response)
	  });
	}).end();

}

function sendMessage(response){

    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: "Here you are : \n"+response
        }]
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status = ' + res.statusCode);
    });
}
// const options = new URL('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=CPN.BK&apikey=ZIBM6AL9W01TSKZH');
// let responseObject
// https.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');

//   var responseString = '';
//   res.on('data', function(data) {
//     responseString += data;
//   });
  
//   let response;
//   res.on('end', function() {
//     console.log(responseString);
//     responseObject = JSON.parse(responseString);
//     let result = responseObject["Time Series (Daily)"];
//     let firstElementKey = Object.keys(result)[0];
//     console.log("NOOM: "+JSON.stringify(firstElementKey));
//     console.log("NOOM: "+JSON.stringify(result[firstElementKey]));
//     response = JSON.stringify(firstElementKey)+"/n"+JSON.stringify(result[firstElementKey]);

//     console.log("response"+response);
//   });
// }).end();






