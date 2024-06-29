const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()

  res.json(blogs)
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch (error) {
    //return res.status(400).json({ error })
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    try {
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } catch (error) {
      //return res.status(400).json({ error })
      next(error)
    }
  } else {
    res.status(404).end()
  }
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(422).json({ error: 'Validation error' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'Duplicate entry' })
  }

  next(error)
}

router.use(errorHandler)

module.exports = router
