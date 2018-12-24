require('custom-env').env(true)

const config = {
  "port" : process.env.PORT,
  "channelAccessToken": process.env.CHANNEL_ACCESS_TOKEN,
  "channelSecret": process.env.CHANNEL_SECRET,
  "topicName": process.env.TOPIC_NAME,
  "appName": process.env.APP_NAME,
  "kafkaHost": process.env.KAFKA_HOST,
}

exports.config = config;