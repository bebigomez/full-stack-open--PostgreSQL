/* eslint-disable no-undef */
require('dotenv').config()

const SECRET = 'SECRET'

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  SECRET
}