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

const getDateRangeMS = (timeRange, tzOffset=0) => {
    if(timeRange.includes(';')){
        return getDateTimeMSRange(timeRange, tzOffset)
    }else if (timeRange.toLowerCase() === "today"){
        return getDayRefMSRange('today', tzOffset)
    }else if (timeRange.toLowerCase() === "yesterday"){
        return getDayRefMSRange('yesterday', tzOffset)
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

// ================
// HELPER FUNCTIONS
// ================
function getDayRefMSRange(dayRef, tzOffset){
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

function getDateTimeMSRange(timeRange, tzOffset){
    const [oldest, latest] = timeRange.split('; ')

    // oldest datetime extraction
    const oldestMS = extractDateTimeMS(oldest, tzOffset)

    // latest datetime extraction
    const latestMS = extractDateTimeMS(latest, tzOffset)

    return {oldestMS, latestMS}
}

function extractDateTimeMS(dateTimeStr, tzOffset){
    const [dateVal, timeVal] = dateTimeStr.split(' ')
    let month, day, year
    if(dateVal.includes('/')){
        [month, day, year] = dateVal.split('/')
    }else if (dateVal === 'today'){
        today = new Date()
        year = today.getFullYear()
        month = today.getMonth() + 1
        day = today.getDate()
    }
    const [HH, MM, Seconds] = timeVal.split(':')
    const dateTime = new Date(year, month-1, day, HH, MM, Seconds)

    // convert to milliseconds and UTC
    const dateMS = ((dateTime.getTime()/1000) - tzOffset).toString()
    return dateMS
}

module.exports = {getChannelHistory, getDateRangeMS, getUserInfo, formatMessages}
