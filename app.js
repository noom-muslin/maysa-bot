// Reply with two static messages
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.env.PORT || 4000

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

    var options = {
	  host: url,
	  port: 80,
	  path: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=CPN.BK&interval=1min&apikey=ZIBM6AL9W01TSKZH',
	  method: 'GET'
	};

	http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	  });
	}).end();

    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: msg
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


