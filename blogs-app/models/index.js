const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'marked_blogs' })
Blog.belongsToMany(User, { through: ReadingList, as: 'blogs_marked' })

module.exports = {
  Blog,
  User,
}
