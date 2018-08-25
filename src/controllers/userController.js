import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const userAction = {
  login: (req, res) => {
    bcrypt.hash(req.body.password, parseInt(process.env.SALTROUND, 10))
      .then((hash) => {
        req.body.password = hash;

        const token = jwt.sign({ userId: req.body.username, pw: req.body.password }, process.env.TOKEN_SECRET, { expiresIn: 3600 * 24 * 366 });
        const message = { username: req.body.username, token };
        res.status(200).json(message);
      })
      .catch(err => res.status(500).json({ err }));
  },
};
export default userAction;
