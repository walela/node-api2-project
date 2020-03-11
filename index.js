const express = require('express')
const cors = require('cors')
const db = require('./data/db')

const app = express()
const PORT = 8888

app.use(express.json())
app.use(cors())

const validatePost = (post, res) => {
  if (!post.title || !post.contents) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
    return false
  }
  return true
}

app.get('/', (_, res) => {
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
    if (post.length === 0) {
      res.status(404).json({ message: `No post with id ${id} found` })
    }
    res
      .status(200)
      .json(post)
      .end()
  } catch (err) {
    res
      .status(500)
      .send({ error: 'The post information could not be retrieved.' })
  }
})

app.get('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params

  try {
    const post = await db.findById(id)
    if (post.length === 0) {
      res
        .status(404)
        .json({ message: `No post with id ${id} found` })
        .end()
    } else {
      const comments = await db.findPostComments(id)
      res.status(200).json(comments)
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The comments information could not be retrieved.' })
  }
})

app.post('/api/posts', async (req, res) => {
  const newPost = req.body
  const validPost = validatePost(newPost, res)

  if (validPost) {
    try {
      const { id } = await db.insert(newPost)
      const createdPost = await db.findById(id)
      res.status(201).json(createdPost)
    } catch (err) {
      res.status(500).json({
        errorMessage: 'There was an error while saving the post to the database'
      })
    }
  }
})

app.post('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params
  const comment = req.body

  try {
    const post = await db.findById(id)
    if (post.length === 0) {
      res
        .status(404)
        .json({ message: `The post with the id ${id} does not exist.` })
        .end()
    }
    if (!comment.text) {
      res
        .status(400)
        .json({ errorMessage: 'Please provide text for the comment.' })
        .end()
    } else {
      const commentId = await db.insertComment(comment)
      const createdComment = await db.findCommentById(commentId.id)
      res.status(201).json(createdComment)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: 'There was an error while saving the comment to the database'
    })
  }
})

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params

  try {
    const post = await db.findById(id)
    if (post.length === 0) {
      res
        .status(404)
        .json({ message: `The post with id ${id} does not exist` })
        .end()
    }
    res.status(200).json(post)
    await db.remove(id)
  } catch (err) {
    res.status(500).json({ errorMessage: 'The post could not be removed' })
  }
})

app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params
  const update = req.body

  const post = await db.findById(id)
  if (post.length === 0) {
    res
      .status(404)
      .json({ message: `The post with id ${id} does not exist` })
      .end()
  }

  const validPost = validatePost(update, res)
  if (validUpdate) {
    try {
      await db.update(id, update)
      const updatedPost = await db.findById(id)
      res.status(200).json(updatedPost)
    } catch (err) {
      res
        .status(500)
        .json({ errorMessage: 'The post information could not be modified.' })
    }
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
