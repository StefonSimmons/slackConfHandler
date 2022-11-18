const express = require('express')
const axios = require('axios')
const app = express()

const PORT = 3000
app.use(express.json())
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})

app.post('/', (req, res) => {
    res.json(req.body)
})