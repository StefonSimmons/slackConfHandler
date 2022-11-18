const express = require('express')
const app = express()
const logger = require('morgan')
const {getChannelHistory} = require('./app')


const PORT = process.env.PORT || 3000
app.use(logger('combined'))
// app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.get('/', (_, res) => {
    res.json({"greeting": "welcome", "today": new Date()})
})

app.post('/', async (req, res) => {
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
         text: '11/21/2022 12:11:09; 11/21/2022 13:08:15',
         api_app_id: 'A04BLHB7MPC',
         is_enterprise_install: 'false',
         response_url: 'https://hooks.slack.com/commands/T04BHJB9B7F/4420002667344/JhX1bZYCkN5Uh2IguRNn90T7',
         trigger_id: '4408942534097.4391623317253.98ffa22b9781055b4495a983b7be6e8c'
       }
     */
  
    const {body}= req

    const dateArr = body.text.split('; ')
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
    const channelID = body.channel_id
    const oldestMS = ((oldestDate.getTime()/1000)-1).toString()
    const latestMS = ((latestDate.getTime()/1000)+1).toString()

    await getChannelHistory(channelID, oldestMS, latestMS)

    
    res.json(req.body)
})