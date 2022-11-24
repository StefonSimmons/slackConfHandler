const express = require('express')
const app = express()
const logger = require('morgan')
const {getChannelHistory, getDateRange, getUserInfo} = require('./app')

const PORT = process.env.PORT || 3000
const ENV = process.env.PORT ? 'production': 'dev'

// const parser = process.env.PORT ? express.urlencoded({ extended: true }) : express.json()
app.use(logger('combined'))

app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.get('/', (_, res) => {
    res.json({"greeting": "welcome", "today": new Date()})
})

app.post('/', async (req, res) => {
    console.log('REQ BODY',req.body)
    /**
       {
         token: '4HgTB5nDVTEUDHvhUw34NbGV',
         team_id: 'T04BHJB9B7F',
         team_domain: 'testslacktoco-rzi8358',
         channel_id: 'C04B60VT3TR',
         channel_name: 'test-channel',
         user_id: 'U04BZ64JAUR',
         user_name: 'stefonsimmons1',
         command: '/save-message',
         text: '11/18/2022 12:11:09; 11/18/2022 13:08:15',
         api_app_id: 'A04BLHB7MPC',
         is_enterprise_install: 'false',
         response_url: 'https://hooks.slack.com/commands/T04BHJB9B7F/4420002667344/JhX1bZYCkN5Uh2IguRNn90T7',
         trigger_id: '4408942534097.4391623317253.98ffa22b9781055b4495a983b7be6e8c'
       }
     */
    /**
     * 
    {
        "token": "4HgTB5nDVTEUDHvhUw34NbGV",
        "team_id": "T04BHJB9B7F",
        "team_domain": "testslacktoco-rzi8358",
        "channel_id": "C04B60VT3TR",
        "channel_name": "test-channel",
        "user_id": "U04BZ64JAUR",
        "user_name": "stefonsimmons1",
        "command": "/save-message",
        "text": "11/18/2022 12:11:09; 11/18/2022 13:08:15",
        "api_app_id": "A04BLHB7MPC",
        "is_enterprise_install": "false",
        "response_url": "https://hooks.slack.com/commands/T04BHJB9B7F/4420002667344/JhX1bZYCkN5Uh2IguRNn90T7",
        "trigger_id": "4408942534097.4391623317253.98ffa22b9781055b4495a983b7be6e8c"
    }
     */
    try {
        const {body} = req
        const channelID = body.channel_id
        const {user} = await getUserInfo(body.user_id)

        console.log('user::', user)
        const {oldestMS, latestMS} = ENV === "production" ?
            getDateRange(body.text, user.tz_offset)
        :
            getDateRange(body.text)
        

        const resp = await getChannelHistory(channelID, oldestMS, latestMS)
        console.log('messages::',resp)
        if(resp.messages.length){
            res.json({status : 200, msg:"working"}) // message that is sent back to user in slack
        }else{
            res.json({err: "not working. no messages"})
        }
        
    } catch (error) {
        console.error('err', error)
    }

    
})