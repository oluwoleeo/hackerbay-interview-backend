import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = {
  loginAuth: (req, res, next) => {
    if (!req.body.username) {
      return res.status(400).json({ message: 'Enter username!' });
    }

    if (req.body.username.trim() === '') {
      return res.status(400).json({ message: 'Invalid username!' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'Enter password!' });
    }

    if (req.body.password.trim() === '') {
      return res.status(400).json({ message: 'Invalid password!' });
    }
    return next();
  },
  allowAccess: (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized for this action. Please log in!' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token invalid/expired! Please log in again!' });
      }

      return next();
    });
  },
};
export default authenticate;
