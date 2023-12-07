import express from 'express'
const app = express()
import logger from 'morgan'
import {getChannelHistory, getDateRangeMS, getUserInfo, formatMessages, directToAuthURL, getAccessToken,getCloudID,postCommentToJira2_0} from './app.js'

const PORT = process.env.PORT || 3000
const ENV = process.env.PORT ? 'production': 'dev'

app.use(logger('combined'))
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})

app.get('/', async (req, res) => {
    const {code, state} = req.query

    if(code && state){
        const accessToken = await getAccessToken(code)
        const cloudID = await getCloudID(accessToken)
        const formattedContent = Buffer.from(state, 'base64').toString('ascii').split(';')[0] // formatted msg from state

        const commentPostedMsg = await postCommentToJira2_0(formattedContent, cloudID, accessToken)
        res.status(201).send(commentPostedMsg)
    }
    res.json({"greeting": "welcome", "today": new Date(), "message": "nothing to see here"})
})

app.post('/', async (req, res) => {
    try {
        const {body} = req
        const channelID = body.channel_id
        const {user} = await getUserInfo(body.user_id)
        const {oldestMS, latestMS} = ENV === "production" ?
            getDateRangeMS(body.text, user.tz_offset)
        :
            getDateRangeMS(body.text)
        
        const {messages} = await getChannelHistory(channelID, oldestMS, latestMS)

        // Message that is sent back to user in slack
        if(messages.length){
            const formattedContent = await formatMessages(messages, channelID)
            await directToAuthURL(formattedContent) // redirects to '/'

            res.status(201).send({message: "check jira card for more"})
        }else{
            res.status(404).send({err: "no messages"})
        }
        
    } catch (error) {
        console.error('APP POST ERROR: ', error.message)
    }
})

app.post('/interactive', async (req, res) => {
    // Any interactions with shortcuts, modals, or interactive components will be sent to https://slack-handler.onrender.com/interactive
    const {body} = req
    res.json(body) 
})