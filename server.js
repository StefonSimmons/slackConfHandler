const express = require('express')
const axios = require('axios')
const app = express()

const PORT = process.env.PORT || 3000
app.use(express.json())
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.get('/', (_, res) => {
    res.json({"greeting": "welcome", "today": new Date()})
})

app.post('/', (req, res) => {
    res.json(req.body)
})