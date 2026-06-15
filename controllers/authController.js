import jwt  from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/login
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400); throw new Error('Informe e-mail e senha para entrar.');
  }
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    res.status(401); throw new Error('Não encontramos uma conta com este e-mail.');
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401); throw new Error('Senha incorreta. Tente novamente.');
  }
  res.json({
    _id: user._id, name: user.name,
    email: user.email, isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Preencha nome, e-mail e senha para criar sua conta.');
  }
  if (name.trim().length < 2) {
    res.status(400); throw new Error('Informe um nome válido.');
  }
  if (!emailRegex.test(email)) {
    res.status(400); throw new Error('Informe um e-mail válido.');
  }
  if (password.length < 6) {
    res.status(400); throw new Error('A senha deve ter no mínimo 6 caracteres.');
  }
  const normalizedEmail = email.toLowerCase().trim();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400); throw new Error('Já existe uma conta com este e-mail. Faça login.');
  }
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  res.status(201).json({
    _id: user._id, name: user.name,
    email: user.email, isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};