const bcrypt = require('bcrypt'); // Importar bcrypt para el hash de contraseñas
const User = require('../models/User'); // Importar el modelo de usuario
const Eleccion = require('../models/Eleccion'); // Importar el modelo de elección

exports.showLogin = (req, res) => { // Renderizar la vista de inicio de sesión
  res.render('login', { alert: null });
};

exports.showRegister = (req, res) => { // Renderizar la vista de registro
  res.render('register', { alert: null });
};

exports.register = async (req, res) => { // Procesar el registro de un nuevo usuario
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/dashboard');
  }

  const { identificacion, correo ,username, edad , password, role } = req.body;
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedCorreo = correo.trim().toLowerCase();
  const validEdad = parseInt(edad, 10);

  if (role === 'admin') {
    return res.render('register', { alert: '⚠️ No tienes permiso para registrar usuarios con rol admin.' });
  }

  if (/\s/.test(trimmedUsername)) {
    return res.render('register', { alert: '⚠️ El nombre de usuario no debe contener espacios.' });
  }

  if (/\s/.test(trimmedCorreo)) {
    return res.render('register', { alert: '⚠️ El correo no debe contener espacios.' });
  }

  if (isNaN(validEdad) || validEdad < 18) {
    return res.render('register', { alert: '⚠️ La edad debe ser un número válido y al menos 18.' });
  }

  const exists = await User.findOne({ where: { identificacion, role } });
  if (exists) {
    return res.render('register', { alert: '⚠️ Ya existe un usuario con esa identificación y rol.' });
  }

  const userExists = await User.findOne({ where: { username: trimmedUsername } });
  if (userExists) {
    return res.render('register', { alert: '⚠️ El nombre de usuario ya está en uso.' });
  }

  const emailExists = await User.findOne({ where: { correo: trimmedCorreo } });
  if (emailExists) {
    return res.render('register', { alert: '⚠️ El correo ya está en uso.' });
  }

  const hash = await bcrypt.hash(password, 10);
  await User.create({ identificacion, correo: trimmedCorreo ,username: trimmedUsername, edad : validEdad ,password_hash: hash, role });

  res.redirect('/login');
};

exports.login = async (req, res) => { // Procesar el inicio de sesión
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (user && await bcrypt.compare(password, user.password_hash)) {
    req.session.user = user;
    res.redirect('/dashboard');
  } else {
    res.render('login', { alert: '⚠️ Credenciales incorrectas' });
  }
};

exports.dashboard = async (req, res) => { // Renderizar el panel de control
  if (!req.session.user) return res.redirect('/login');

  let eleccionesDisponibles = 0;
  if (req.session.user.role === 'votante') {
    eleccionesDisponibles = await Eleccion.count({ where: { estado: 'activa' } });
  }

  res.render('dashboard', {
    user: req.session.user,
    eleccionesDisponibles
  });
};

exports.logout = (req, res) => { // Procesar el cierre de sesión
  req.session.destroy();
  res.redirect('/login');
};
