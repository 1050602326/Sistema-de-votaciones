const multer = require('multer'); // esto es para manejar la subida de archivos
const path = require('path'); // esto es para manejar las rutas de los archivos

const storage = multer.diskStorage({ /* esto es para configurar el almacenamiento de los archivos subidos */
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) { // esto es para configurar el nombre del archivo subido
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ /* esto es para crear el middleware de multer */
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      return cb(new Error('Solo se permiten imágenes JPG o PNG'));
    }
    cb(null, true);
  }
});

module.exports = upload; // Exportar el middleware de multer para que pueda ser utilizado en otros archivos
// multer es un middleware para manejar la subida de archivos en Node.js.
// Se utiliza para procesar los archivos subidos a través de formularios HTML.
// En este caso, se está configurando multer para almacenar los archivos subidos en la carpeta 'uploads/'
// y se les asigna un nombre único basado en la fecha y un número aleatorio.
// También se establece un límite de tamaño de archivo de 2MB y se permite solo la subida de imágenes en formato JPG o PNG.
// multer equivale a un middleware que se encarga de procesar los archivos subidos a través de formularios HTML.
// el middleware significa que se ejecuta antes de que la solicitud llegue a la ruta correspondiente.