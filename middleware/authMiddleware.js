import jwt  from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }
      req.user = user;
      return next();
    } catch {
      return res.status(401).json({ message: 'Token inválido.' });
    }
  }
  if (!token) res.status(401).json({ message: 'Sem autorização, sem token.' });
};

export const admin = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  res.status(401).json({ message: 'Acesso negado — não é admin' });
};
