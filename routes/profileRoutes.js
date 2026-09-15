const express = require('express'); // esto es para importar express, que es un framework de Node.js para crear aplicaciones web
const router = express.Router(); // esto es para crear un router de express, que es un objeto que maneja las rutas de la aplicación
const profileController = require('../controllers/profileController'); // esto es para importar el controlador de perfil, que es un objeto que contiene las funciones que manejan las rutas de perfil
const upload = require('../middlewares/upload'); // esto es para importar el middleware de multer, que es un objeto que maneja la subida de archivos

router.get('/profile', profileController.getProfile); // esto es para manejar la ruta de perfil, que muestra el perfil del usuario autenticado
router.post('/profile', upload.single('profile_picture'), profileController.updateProfile); // esto es para manejar la ruta de perfil, que recibe los datos del formulario de perfil y actualiza el perfil del usuario autenticado

module.exports = router;
// acá se define la ruta para el perfil de usuario, que permite obtener y actualizar la información del perfil.