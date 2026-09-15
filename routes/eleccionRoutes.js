const express = require('express');
const router = express.Router();
const eleccionController = require('../controllers/eleccionController');

// Middleware seguro para restringir solo a administradores
function onlyAdmin(req, res, next) {
  if (req.session && req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'administrativo')) {
    return next();
  }
  res.redirect('/login'); // Redirigir al login si no hay sesión o rol adecuado
}

// Rutas protegidas por onlyAdmin
router.get('/elecciones/crear', onlyAdmin, eleccionController.showForm);
router.post('/elecciones/crear', onlyAdmin, eleccionController.create);
router.get('/elecciones', onlyAdmin, eleccionController.listAll);

router.post('/elecciones/activar/:id', onlyAdmin, eleccionController.activar);
router.post('/elecciones/finalizar/:id', onlyAdmin, eleccionController.finalizar);
router.post('/elecciones/eliminar/:id', onlyAdmin, eleccionController.eliminar);
router.post('/elecciones/estado/:id', onlyAdmin, eleccionController.cambiarEstado);
router.get('/elecciones/editar/:id', onlyAdmin, eleccionController.showEditForm);
router.post('/elecciones/editar/:id', onlyAdmin, eleccionController.update);


module.exports = router;
