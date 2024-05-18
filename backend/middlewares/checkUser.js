const jwt = require('jsonwebtoken');
const accessTokenSecret = 'secret';

const checkUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, accessTokenSecret);

    req.coach = decoded; // Attach decoded user to request

    // Check for coach role directly from decoded token
    if (decoded.role !== 'user') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    next(); // Allow access for coaches
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Unauthorized' }); // General error handling
  }
};
const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
module.exports = { authenticate };  
module.exports = checkUser;