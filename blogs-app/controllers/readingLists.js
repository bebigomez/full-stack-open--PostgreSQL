const router = require('express').Router()

const ReadingList = require('../models/reading_list.js')

router.post('/', async (req, res) => {
  const addedBlog = await ReadingList.create({ ...req.body })
  res.json(addedBlog)
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  next(error)
}

router.use(errorHandler)

module.exports = router
