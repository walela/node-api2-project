const express = require('express')
const postRoutes = require('./postRoutes')

const app = express()
const PORT = 8888

app.use(express.json())
app.use('/api/posts', postRoutes)

app.get('/', (_, res) => {
  res.send('Hey')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
