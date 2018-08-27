import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import fjp from 'fast-json-patch';

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
  patchjson: (req, res) => {
    try {
      JSON.parse(req.body.jsontopatch);
    } catch (error) {
      return res.status(400).json({ error: 'JSON object to be updated is invalid' });
    }

    try {
      JSON.parse(req.body.jsonpatch);
    } catch (error) {
      return res.status(400).json({ error: 'JSON patch object for update is invalid' });
    }

    const document = JSON.parse(req.body.jsontopatch);
    const patch = JSON.parse(req.body.jsonpatch);
    const { newDocument } = fjp.applyPatch(document, patch);
    return res.status(200).json({ newDocument });
  },
};
export default userAction;
