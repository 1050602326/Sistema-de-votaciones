const Candidatura = require('../models/Candidatura');
const User = require('../models/User');
const Eleccion = require('../models/Eleccion');

const express = require('express');
const router = express.Router();
const candidaturaController = require('../controllers/candidaturaController');

function onlyAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/dashboard');
}

router.get('/elecciones/:id/candidatos', onlyAdmin, candidaturaController.showForm);
router.post('/elecciones/:id/candidatos', onlyAdmin, candidaturaController.create);

// ✅ Editar candidatura (controlador actualizado)
router.get('/candidaturas/editar/:id', onlyAdmin, candidaturaController.editForm);

// Procesar edición
router.post('/candidaturas/editar/:id', onlyAdmin, async (req, res) => {
  const { propuesta } = req.body;
  const candidatura = await Candidatura.findByPk(req.params.id);

  if (!candidatura) {
    req.flash('alert', '❌ Candidatura no encontrada.');
    return res.redirect('/elecciones');
  }

  const palabras = propuesta.trim().split(/\s+/);
  if (palabras.length < 3) {
    req.flash('alert', '⚠️ La propuesta debe tener al menos 3 palabras.');
    return res.redirect(`/candidaturas/editar/${candidatura.id}`);
  }

  await candidatura.update({ propuesta });
  req.flash('alert', '✅ Propuesta actualizada correctamente.');
  res.redirect(`/elecciones/${candidatura.eleccionId}/candidatos`);
});

// Eliminar candidatura
router.post('/candidaturas/eliminar/:id', onlyAdmin, async (req, res) => {
  const candidaturaId = req.params.id;
  const candidatura = await Candidatura.findByPk(candidaturaId);

  if (!candidatura) {
    req.flash('alert', '❌ Candidatura no encontrada.');
    return res.redirect('/elecciones');
  }

  await Candidatura.destroy({ where: { id: candidaturaId } });
  req.flash('alert', '✅ Candidatura eliminada correctamente.');
  res.redirect(`/elecciones/${candidatura.eleccionId}/candidatos`);
});

module.exports = router;
