// routes/votoRoutes.js
const express = require('express');
const router = express.Router();
const votoController = require('../controllers/votoController');

function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

function onlyVotante(req, res, next) {
  if (req.session.user && req.session.user.role === 'votante') return next();
  res.redirect('/dashboard');
}

router.get('/votar/elecciones', ensureAuthenticated, onlyVotante, votoController.listarEleccionesActivas);
router.get('/votar/:id', ensureAuthenticated, onlyVotante, votoController.verCandidatos);
router.post('/votar', ensureAuthenticated, onlyVotante, votoController.emitirVoto);
router.get('/resultados/:id', ensureAuthenticated, votoController.verResultadosEleccion);
router.get('/mis-votos', ensureAuthenticated, onlyVotante, votoController.misVotos);


module.exports = router;
