const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_CONF_BOT_TOKEN);

const getChannelHistory = async (channelID, oldestTime, latestTime) => {
    // console.log(channelID, oldestTime, latestTime)
    try {
      const list = await web.conversations.history({channel:channelID, oldest: oldestTime, latest: latestTime});
      console.log('Message Events');
      console.log(list)
    } catch (error) {
      console.log(error.data);
    }
}

module.exports = {getChannelHistory}
