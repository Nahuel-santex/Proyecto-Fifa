
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    
    const user = await User.create({ username, password });

    res.status(201).json({ message: 'Usuario creado exitosamente', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    res.json({ message: 'Login exitoso', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

module.exports = router;