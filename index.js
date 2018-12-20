'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
const uuid = require('uuid/v4');
const kafka = require('kafka-node');

const port = process.env.PORT || config.port ;
const KeyedMessage = kafka.KeyedMessage
const Producer = kafka.Producer;

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
    handleEvent("DEMO")
  });

app.post('/webhook', line.middleware(config), (req, res) => {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
      return res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(event => {
      console.log('RECIEVE:', event);

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
    var producer =  new Producer(client);

    var corelationId = config.appName+'-'+uuid();
    console.log('HANDLE:', corelationId, " ::: ", event);
    var eventMessage = new KeyedMessage(corelationId, event);
    var payloads = [
        { topic: config.topicName, messages: eventMessage }
    ];

    producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
            console.log("SEND PAYLOAD:", payloads[0].messages, " DATA:", data);
        });
    });
    
    producer.on('error', function (err) {
        console.log("ERROR:",err);
    })
}

app.listen(port, () => {
  console.log(`listening on ${port}`);
});