const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware.js')

const ReadingList = require('../models/reading_list.js')

router.post('/', async (req, res) => {
  const addedBlog = await ReadingList.create({ ...req.body })
  res.json(addedBlog)
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingList = await ReadingList.findByPk(req.params.id);
    
    if (!readingList) {
      return res.status(404).end();
    }
    
    if (req.decodedToken.id !== readingList.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    readingList.read = req.body.read;
    await readingList.save();

    res.json(readingList);
  } catch (error) {
    next(error);
  }
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  next(error)
}

router.use(errorHandler)

module.exports = router
