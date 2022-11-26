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


const getUserInfo = async (userID) => {
    return await web.users.info({user: userID})
}

const getDateRange = (timeRange, tzOffset=0) => {
    if(timeRange.includes(';')){
        const [oldest, latest] = timeRange.split('; ')
        
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
        
        const oldestMS = ((oldestDate.getTime()/1000) - tzOffset).toString()
        const latestMS = ((latestDate.getTime()/1000) - tzOffset).toString()
        return {oldestMS, latestMS}
    }else if (timeRange.toLowerCase() === "today"){
        return getSingularDayMSRange('today', tzOffset)
    }else if (timeRange.toLowerCase() === "yesterday"){
        return getSingularDayMSRange('yesterday', tzOffset)
    }

}

const formatMessages = async (messages, channelID) => {
    let conversation = ""

    // Note: do not use async in forEach: https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971
    for(message of messages.reverse()){
        conversation += `${message.text}\n`
        if(message.reply_count){
            const replies = await web.conversations.replies({channel: channelID, ts: message.thread_ts}) 
            let thread = ""
            replies.messages.forEach((reply, idx) => {   
                // add logic for list replies
                idx && (thread += `\t- ${reply.text}\n`)
            })
            conversation += thread
        }
    }

    return conversation
}

/** HELPERS */
const getSingularDayMSRange = (dayRef, tzOffset) => {
    let day = new Date()

    if(dayRef === "yesterday"){
        day = new Date(day.setDate(day.getDate() - 1))
    }

    const year = day.getFullYear()
    const month = day.getMonth()
    const date = day.getDate()
    const oldestMS = ((new Date(year, month, date).getTime()/1000) - tzOffset).toString()
    const latestMS = ((day.getTime()/1000) - tzOffset).toString()
    return {oldestMS, latestMS}
}

module.exports = {getChannelHistory, getDateRange, getUserInfo, formatMessages}
