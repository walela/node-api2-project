const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const app = express()
const PORT = 8888

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hey')
})

app.get('/api/posts', async (_, res) => {
  try {
    const posts = await db.find()
    res.status(200).json(posts)
  } catch (err) {
    res.status(500).json({
      errorMessage: 'The posts information could not be retrieved.'
    })
  }
})

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const post = await db.findById(id)
    if (!post) {
      res.status(404).json({ message: `No post with id ${id} found` })
    }
    res.status(200).json(post)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
