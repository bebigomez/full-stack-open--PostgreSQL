const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const ActiveSession = require('../models/active_session')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const activeSession = await ActiveSession.findOne({
    where: {
      username: body.username,
    },
  });

  if (activeSession) {
    return response.status(400).json('You already have an active session').end();
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await ActiveSession.create({
    token,
    username: user.username,
  })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
