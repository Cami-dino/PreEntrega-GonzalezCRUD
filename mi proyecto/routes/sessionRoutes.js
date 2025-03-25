import express from 'express';
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import passport from 'passport';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'Email ya registrado' });

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password)
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Ruta protegida para obtener datos del usuario con JWT (current)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default router;
