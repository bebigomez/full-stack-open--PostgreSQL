const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const ActiveSession = require('../models/active_session')
const { User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7);
      const decodedToken = jwt.verify(token, SECRET);

      const activeSession = await ActiveSession.findOne({
        where: {
          username: decodedToken.username,
        },
      });

      if (!activeSession || activeSession.token !== token) {
        return res.status(401).json({ error: 'Session expired or invalid' });
      }

      const user = await User.findOne({
        where: {
          username: decodedToken.username,
        },
      });

      if (!user || user.disabled) {
        return res.status(401).json({
          error: 'Your account has been disabled, please contact admin.',
        });
      }

      req.decodedToken = decodedToken;
    } catch (error) {
      console.error('Error in tokenExtractor:', error);
      return res.status(401).json({ error: 'Token invalid or expired' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }

  next();
};


module.exports = {
  tokenExtractor,
}
