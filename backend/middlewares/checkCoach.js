const jwt = require('jsonwebtoken');
const accessTokenSecret = 'secret';

const checkCoach = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, accessTokenSecret);

    req.coach = decoded;

    if (decoded.role !== 'coach') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Unauthorized' });
  }
};

module.exports = checkCoach;