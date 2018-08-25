const authenticate = {
  loginAuth: (req, res, next) => {
    if (!req.body.username) {
      return res.status(400).json({ message: 'Enter username!' });
    }

    if (req.body.username.trim() === '') {
      return res.status(400).json({ message: 'Username cannot be spaces!!' });
    }

    if (!req.body.password) {
      return res.status(400).json({ message: 'Enter password!' });
    }

    if (req.body.password.trim() === '') {
      return res.status(400).json({ message: 'Password cannot be spaces!' });
    }
    return next();
  },
};
export default authenticate;
