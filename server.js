const express = require('express')
const app = express()
const logger = require('morgan')

const PORT = process.env.PORT || 3000
app.use(logger('combined'))
app.use(express.urlencoded({ extended: true }))
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.get('/', (_, res) => {
    res.json({"greeting": "welcome", "today": new Date()})
})

app.post('/', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})