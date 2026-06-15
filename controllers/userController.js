import User from '../models/User.js';
import jwt  from 'jsonwebtoken';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

// GET /api/users/profile — protegido
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }

  res.json({
    _id:     user._id,
    name:    user.name,
    email:   user.email,
    isAdmin: user.isAdmin,
  });
};

// PUT /api/users/profile — protegido
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }

  user.name  = req.body.name  || user.name;
  user.email = req.body.email ? req.body.email.toLowerCase().trim() : user.email;

  if (req.body.password) {
    if (req.body.password.length < 6) {
      res.status(400);
      throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
    }
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    _id:     updated._id,
    name:    updated.name,
    email:   updated.email,
    isAdmin: updated.isAdmin,
    token:   generateToken(updated._id),
  });
};

// GET /api/users — somente admin
export const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// DELETE /api/users/:id — somente admin
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Usuário não encontrado.');
  }

  if (user.isAdmin) {
    res.status(400);
    throw new Error('Não é possível remover um administrador.');
  }

  await user.deleteOne();
  res.json({ message: 'Usuário removido com sucesso.' });
};