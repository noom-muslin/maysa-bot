require('custom-env').env(true)

const config = {
  "port" : process.env.PORT,
  "channelSecret": process.env.CHANNEL_SECRET,
  "webhookTopicName": process.env.WEBHOOK_TOPIC_NAME,
  "appName": process.env.APP_NAME,
  "kafkaHost": process.env.KAFKA_HOST,
  "validate": validate === undefined ? true : validate
}

exports.config = config;