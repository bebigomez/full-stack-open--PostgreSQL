const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    order: [['likes', 'DESC']],
    where,
  })

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

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
    })
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

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    // Buscar al usuario autenticado por su ID en el token
    const user = await User.findByPk(req.decodedToken.id)

    if (user) {
      // Buscar el blog específico por su ID
      const blog = await Blog.findByPk(req.params.id)

      if (blog) {
        // Si el blog pertenece al usuario autenticado, proceder con la eliminación
        await blog.destroy()
        res.status(204).end() // 204 No Content
      } else {
        // Si el blog no fue encontrado...
        res.status(404).json({ error: 'Blog not found' }) // 404 Not Found
      }
    } else {
      // Si el usuario no está autenticado correctamente
      res.status(401).json({ error: 'Unauthorized' }) // 401 Unauthorized
    }
  } catch (error) {
    next(error)
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
