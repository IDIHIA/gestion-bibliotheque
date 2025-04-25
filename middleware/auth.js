module.exports = (req, res, next) => {
    const { login, password } = req.headers;
  
    if (login === 'admin' && password === 'admin') {
      next();
    } else {
      res.status(401).json({ message: 'Non autorisé' });
    }
  };
  