const express = require('express');
const router = express.Router();
const resultadosController = require('../controllers/resultadosController');
const pdfController = require('../controllers/pdfController');

function ensureAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

router.get('/resultados', ensureAuthenticated, resultadosController.verResultados);

router.get('/resultados/:id/pdf', ensureAuthenticated, pdfController.descargarResultadosPDF);
router.get('/resultados/:id/csv', ensureAuthenticated, pdfController.descargarResultadosCSV);


module.exports = router;
