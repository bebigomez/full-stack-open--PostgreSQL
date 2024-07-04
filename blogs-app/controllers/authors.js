const router = require('express').Router()
const sequelize = require('sequelize')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes'],
    ],
    order: [ ['total_likes', 'DESC'] ],
    group: ['author'],
  })

  res.json(blogs)
})

module.exports = router
