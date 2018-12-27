'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const Config = require('./config.js');
const uuid = require('uuid/v4');
const kafka = require('kafka-node');

const config = Config.config;
const port = process.env.PORT || config.port ;
const KeyedMessage = kafka.KeyedMessage
const HighLevelProducer = kafka.HighLevelProducer

const options = {
    requireAcks: 1,
    ackTimeoutMs: 100,
    partitionerType: 2
}

const client = new kafka.KafkaClient({kafkaHost: config.kafkaHost});
const producer =  new HighLevelProducer(client, options);

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
    handleEvent(JSON.parse('{"type":"message","replyToken":"9407d326aef742cfab5517c35662f7e7","source":{"userId":"Uafdea049ee01fdfe5085af9d88cb3512","type":"user"},"timestamp":1545811209919,"message":{"type":"text","id":"9073356552278","text":"DEMOOOOOOO"}}'));
  });

app.post('/webhook', line.middleware(config), (req, res) => {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(event => {
      return handleEvent(event);
    }))
    .then(() => res.end())
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });
  });

function handleEvent(event) {

    var corelationId = config.appName+'-'+uuid();
    var eventMessage = new KeyedMessage(corelationId, event);
    var payloads = [
        // { topic: config.topicName, messages: JSON.stringify(eventMessage) },
        { topic: config.topicName, messages: JSON.stringify(eventMessage) }
    ];
    producer.send(payloads, function (err, data) {
        console.log("SEND PAYLOAD:", JSON.stringify(payloads), " DATA:", data);
    });
}

producer.on('ready', function () {
    console.log("KAFKA IS READY");
});

producer.on('error', function (err) {
    console.log("ERROR:",err);
})

app.listen(port, () => {
  console.log(`listening on ${port}`);
});