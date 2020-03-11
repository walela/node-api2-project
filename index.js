const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const app = express()
const PORT = 8888

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('yo')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
