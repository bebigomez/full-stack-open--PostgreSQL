const router = require('express').Router()
const { Op } = require('sequelize')

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false],
  }
  if (req.query.read) {
    read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'read'],
          where: {
            read,
          },
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    try {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } catch (error) {
      return res.status(400).json({ error })
    }
  } else {
    res.status(404).end()
  }
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.json({ error: 'Validation isEmail on username failed' })
  }

  next(error)
}

router.use(errorHandler)

module.exports = router
