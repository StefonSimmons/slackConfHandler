const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_CONF_BOT_TOKEN);

const getChannelHistory = async (channelID, oldestTime, latestTime) => {
    try {
      const resp = await web.conversations.history({channel:channelID, oldest: oldestTime, latest: latestTime, inclusive: true});
      return resp
    } catch (error) {
      console.log('getChannelHistory ERR',error);
    }
}

const getDateRange = (param) => {
    // https://api.slack.com/reference/surfaces/formatting#date-formatting
    const [oldest, latest] = param.split('; ')
    
    // oldest datetime extraction
    const [oldestDateVal, oldestTimeVal] = oldest.split(' ')
    const [oldMonth, oldDay, oldYear] = oldestDateVal.split('/')
    const [oldHH, oldMM, oldSec] = oldestTimeVal.split(':')
    const oldestDate = new Date(oldYear, oldMonth-1, oldDay, oldHH, oldMM, oldSec)

    // latest datetime extraction
    const [latestDateVal, latestTimeVal] = latest.split(' ')
    const [latestMonth, latestDay, latestYear] = latestDateVal.split('/')
    const [latestHH, latestMM, latestSec] = latestTimeVal.split(':')
    const latestDate = new Date(latestYear, latestMonth-1, latestDay, latestHH, latestMM, latestSec)

    const oldestMS = ((new Date(oldestDate.toUTCString()).getTime()/1000)).toString()
    const latestMS = ((new Date(latestDate.toUTCString()).getTime())/1000).toString()
    return {oldestMS, latestMS}
}

module.exports = {getChannelHistory, getDateRange}
