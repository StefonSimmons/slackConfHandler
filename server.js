require('dotenv').config()
const express = require('express')
const app = express()
const logger = require('morgan')
const {getChannelHistory, getDateRangeMS, getUserInfo, formatMessages} = require('./app')

const PORT = process.env.PORT || 3000
const ENV = process.env.PORT ? 'production': 'dev'

app.use(logger('combined'))
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.get('/', (_, res) => {
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
            res.send(formattedContent)
        }else{
            res.status(404).send({err: "no messages"})
        }
        
    } catch (error) {
        console.error('ERROR: ', error.message)
    }
})

app.post('/interactive', async (req, res) => {
    const {body} = req
    res.json(body) 
})