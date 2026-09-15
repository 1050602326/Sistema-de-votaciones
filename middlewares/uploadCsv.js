const multer = require('multer'); // Esto es para manejar la subida de archivos
const path = require('path'); // Esto es para manejar las rutas de los archivos

const storage = multer.diskStorage({ // esto es para configurar el almacenamiento de los archivos subidos
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, name + path.extname(file.originalname));
  }
});

const uploadCsv = multer({ // esto es para crear el middleware de multer
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.csv') {
      return cb(new Error('Solo se permiten archivos CSV.'));
    }
    cb(null, true);
  }
});

module.exports = uploadCsv; // Exportar el middleware de multer para que pueda ser utilizado en otros archivos
