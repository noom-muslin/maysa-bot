// Reply with two static messages
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 4000
const URL = require('url').URL;
const _ = require('lodash-node/compat');
const axios = require('axios');
const request = require('request');
const path = require("path");


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.post('/webhook', (req, res) => {
    let reply_token = req.body.events[0].replyToken
    let msg = req.body.events[0].message.text
    getStockData(msg)
    console.log(req)
    reply(reply_token, msg)
    res.sendStatus(200)
})

app.listen(port)
function reply(reply_token, msg) {
    getStockData(msg).then(response => {
        console.debug("DEBUG:" + response)
        sendMessage(msg, response, reply_token)
    })
}

app.get('/chart',function(req,res){
    res.sendFile(path.join(__dirname+'/chart.html'));
  });

function getStockData(msg){
    const request = axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+msg+'.BK&apikey=ZIBM6AL9W01TSKZH')
    .then(response => {
        console.log('STATUS: ' + response.statusCode);
    	console.log('HEADERS: ' + JSON.stringify(response.headers));
        console.log('DATA: ' + JSON.stringify(response.data));
        let firstElement = response.data["Time Series (Daily)"]
        let firstElementKey = Object.keys(firstElement)[0]
        let result = JSON.stringify(firstElementKey)+" "+JSON.stringify(firstElement[firstElementKey])
        return result;
    })
    .catch(error => {
        console.log(error);
    })

    return request
}

function sendMessage(msg, response,reply_token){
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {lwIfAPK5C+0hfoIcSjTjw8IlaMuuVVDlFbiZbUZb1rngt6ZavKw2uTPXsVayF5KRuS8VR6ZjKAnEN7veRIWzDQOQly9LcOhAMN6Z81skFi70mVm2XOtvHfl8K05TqccU8hamC277MAnLh2CwYQ0CBAdB04t89/1O/w1cDnyilFU=}'
    }
    console.debug("DEBUG sendMessage:" + response)

    let body = JSON.stringify({
        replyToken: reply_token,
        messages: [{
            type: 'text',
            text: 'Here you are ['+msg.toUpperCase()+'] : '+response
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

// getStockData("CPN").then(response => console.log("###:"+response));