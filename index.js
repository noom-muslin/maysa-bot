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

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
    handleEvent(config)
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
    var client = new kafka.KafkaClient({kafkaHost: config.kafkaHost});
    var producer =  new HighLevelProducer(client);

    var corelationId = config.appName+'-'+uuid();

    var eventMessage = new KeyedMessage(corelationId, event);
    var payloads = [
        { topic: config.topicName, messages: JSON.stringify(eventMessage) }
    ];

    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log("SEND PAYLOAD:", JSON.stringify(payloads), " DATA:", data);
        });
    });
    
    producer.on('error', function (err) {
        console.log("ERROR:",err);
    })
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});