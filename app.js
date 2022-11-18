const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_CONF_BOT_TOKEN);

const getChannelHistory = async (channelID, oldestTime, latestTime) => {
    try {
      const messages = await web.conversations.history({channel:channelID, oldest: oldestTime, latest: latestTime});
      return messages
    } catch (error) {
      console.log(error.data);
    }
}

const getDateRange = (param) => {
    const dateArr = param.split('; ')
    const oldest = dateArr[0]
    const oldestDateStr = oldest.split(' ')[0]
    const oldestTimeStr = oldest.split(' ')[1]

    const latest = dateArr[1]
    const latestDateStr = latest.split(' ')[0]
    const latestTimeStr = latest.split(' ')[1]
    const oldestDateArr = oldestDateStr.split('/')
    const latestDateArr = latestDateStr.split('/')

    const oldestTimeArr = oldestTimeStr.split(':')
    const latestTimeArr = latestTimeStr.split(':')

    const oldestDate = new Date(oldestDateArr[2], oldestDateArr[0]-1, oldestDateArr[1], oldestTimeArr[0], oldestTimeArr[1], oldestTimeArr[2])
    const latestDate = new Date(latestDateArr[2], latestDateArr[0]-1, latestDateArr[1], latestTimeArr[0], latestTimeArr[1], latestTimeArr[2])
    const oldestMS = ((oldestDate.getTime()/1000)-1).toString()
    const latestMS = ((latestDate.getTime()/1000)+1).toString()
    return {oldestMS, latestMS}
}

module.exports = {getChannelHistory, getDateRange}