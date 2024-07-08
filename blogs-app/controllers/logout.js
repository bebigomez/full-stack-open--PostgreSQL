const router = require('express').Router()
const ActiveSession = require('../models/active_session')

router.delete('/', async (req, res) => {

  const authorization = req.get('authorization').substring(7)

  try {
    const deletedSession = await ActiveSession.destroy({
      where: {
        token: authorization,
      },
    })

    if (deletedSession) {
      res.status(200).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.error('Error deleting active session:', error)
    res.status(500).end()
  }
})

module.exports = router
