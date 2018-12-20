'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
const port = process.env.PORT || 4000

// create LINE SDK client
const client = new line.Client(config);

const app = express();

app.get('/', (req, res) => {
    res.send('hello world');
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
    console.log('HANDLE:', event);
  }

app.listen(port, () => {
  console.log(`listening on ${port}`);
});