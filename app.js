const { WebClient } = require('@slack/web-api');
const axios = require('axios')
require('dotenv').config();

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

const getDateRangeMS = (dateTimeRange, tzOffset=0) => {
    const dateRegex = new RegExp('[0-9]{2}\/[0-9]{2}\/[0-9]{4}$');
    if(dateTimeRange.includes(';')){
        return getDateTimeMSRange(dateTimeRange, tzOffset)
    }else if (dateTimeRange.toLowerCase() === "today"){
        return getSingleDayMSRange('today', tzOffset)
    }else if (dateTimeRange.toLowerCase() === "yesterday"){
        return getSingleDayMSRange('yesterday', tzOffset)
    }else if (dateRegex.test(dateTimeRange)){
        return getSingleDayMSRange('singleDate', tzOffset, dateTimeRange )
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


/**
 * Uses the JIRA cloud API to post formatted Slack conversations to Jira
 * @param {string} comment 
 * @returns {object}
 */
const postCommentToJira = async (comment) => {
    const url = 'https://slack-to-jira-dd.atlassian.net/rest/api/3/issue/TP-1/comment'
    const basicAuth = {
        auth: {
            username: 'stefon.simmons@datadoghq.com',
            password: process.env.ATLASSIAN_KEY
        }
    }
    const bodyData = {
        "body": {
          "content": [
            {
              "content": [
                {
                  "text": comment,
                  "type": "text"
                }
              ],
              "type": "paragraph"
            }
          ],
          "type": "doc",
          "version": 1
        }
    };
    try {
        const resp = await axios.post(url, bodyData, basicAuth)
        if(resp.status === 201){
            return {text: 'Successfully posted to Jira!'}
        }else{
            return {text: `Post Comment To Jira Issue: Response Status ${resp.status}`}
        }
    } catch (error) {
        console.log('Post Comment ERROR: ', error.message)
        return {text: `Post Comment ERROR:, ${error.message}`}
    }
}

// ================
// HELPER FUNCTIONS
// ================

/**
 * For singular date or date ref input conversion to milliseconds
 * @param {string} dayRef 'today', 'yesterday', single date (ex: '11/21/2022')
 * @param {number} tzOffset 
 * @param {string} [dateStr=null]
 * @returns {object} i.e. 12:00am and 11:59pm datetimes in milliseconds for a singular date
 */
function getSingleDayMSRange(dayRef, tzOffset, dateStr=null){
    let day = new Date() // today date ref
    if(dayRef === "yesterday"){
        day = new Date(day.setDate(day.getDate() - 1)) // yesterday date ref
    }else if (dayRef === "singleDate"){
        day = new Date(dateStr) // single date 
    }

    const oldestMS = ((new Date(day).setHours(0,0,0,0)/1000) - tzOffset).toString()
    const latestMS = extractEndOfDayMS(day, tzOffset)
    return {oldestMS, latestMS}
}


/**
 * For datetime range input conversion to millseconds 
 * @param {string} dateTimeRange datetime range (ex: '01/18/2022 12:11:09; 01/18/2022 13:08:15')
 * @param {number} tzOffset 
 * @returns {object} oldest and latest datetimes in milliseconds for a specific datetime range
 */
function getDateTimeMSRange(dateTimeRange, tzOffset){
    const dateRegex = new RegExp('[0-9]{2}\/[0-9]{2}\/[0-9]{4}$');
    const [oldest, latest] = dateTimeRange.split('; ')

    // oldest datetime extraction
    const oldestMS = extractDateTimeMS(oldest, tzOffset)

    // latest datetime extraction
    // if latest is only a date, then get the end of day time in MS else extract the exact specified datetime in MS
    const latestMS = dateRegex.test(latest) ? extractEndOfDayMS(latest , tzOffset) : extractDateTimeMS(latest, tzOffset)

    return {oldestMS, latestMS}
}

function extractDateTimeMS(dateTimeStr, tzOffset){
    const [dateVal, timeVal] = dateTimeStr.split(' ')

    let date
    if(dateVal){
        if(dateVal.includes('/')){
            date = new Date(dateVal)
        }else if (dateVal === 'today'){
            date = new Date()
        }else if (dateVal === 'yesterday'){
            today = new Date()
            date = new Date(today.setDate(today.getDate() - 1))
        }
    }

    let HH = MM = Seconds = 0 // default value 0
    if(timeVal){
        [HH, MM, Seconds] = timeVal.split(':')
    }
    
    // const dateTime = new Date(year, month-1, day, HH, MM, Seconds)
    const dateTime = new Date(date.setHours(HH, MM, Seconds))

    // convert to UTC time in milliseconds
    const dateMS = ((dateTime.getTime()/1000) - tzOffset).toString()
    return dateMS
}

function extractEndOfDayMS(day, tzOffset){
    return ((new Date(day).setHours(23, 59, 59, 999)/1000) - tzOffset).toString()
}

module.exports = {getChannelHistory, getDateRangeMS, getUserInfo, formatMessages, postCommentToJira}
