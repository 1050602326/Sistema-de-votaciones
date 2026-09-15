# estructura del proyecto
LOGIN-SYSTEM/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── profileController.js
├── middlewares/
│   └── upload.js
├── models/
│   ├── User.js
│   └── UserProfile.js
├── node_modules/
├── public/
│   └── style.css
├── routes/
│   ├── authRoutes.js
│   └── profileRoutes.js
├── uploads/
│   ├── 1745557560341-196712223.jpg
│   └── default.jpg
├── views/
│   ├── dashboard.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── register.ejs
├── app.js
├── package-lock.json
├── package.json
└── readme.md

# estructura del proyecto con la descripción 

LOGIN-SYSTEM/ 
├── config/                # Configuración de la base de datos 
│ └── db.js 
├── controllers/ # Lógica de negocio 
│ 
├── authController.js      # Registro, login y logout 
│ └── profileController.js # Vista y edición del perfil 
├── middlewares/           # Funciones intermedias 
│ └── upload.js            # Subida de archivos con multer 
├── models/                # Definición de modelos Sequelize 
│ 
├── User.js 
│ └── UserProfile.js 
├── node_modules/         # Dependencias del proyecto (se crean Automaticamente bajo comando)
├── public/               # Recursos estáticos (CSS, imágenes) 
│ └── style.css 
├── routes/               # Definición de rutas Express 
│ ├── authRoutes.js 
│ └── profileRoutes.js 
├── uploads/              # Carpeta para imágenes de perfil 
│ ├── default.jpg 
│ └── *.jpg 
├── views/                # Vistas EJS 
│ ├── dashboard.ejs 
│ ├── login.ejs 
│ ├── profile.ejs 
│ └── register.ejs 
├── app.js               # Archivo principal del servidor 
├── package.json         # Dependencias y scripts (se crean Automaticamente bajo comando, no crear manualmente)
├── package-lock.json    # Dependencias y scripts (se crean Automaticamente bajo comando, no crear manualmente)
└── readme.md            # Documentación del proyecto

# crear la base de datos en admin de Mysql: 
http://localhost/phpmyadmin/
create DATABASE login_db;

#
npm init -y
# Inicializa un nuevo proyecto Node.js con un archivo package.json predeterminado.

#
npm install express mysql2 sequelize bcrypt ejs express-session
# Instala las siguientes dependencias:
# - express: Framework para construir aplicaciones web y APIs.
# - mysql2: Cliente para conectarse a bases de datos MySQL.
# - sequelize: ORM para interactuar con bases de datos SQL.
# - bcrypt: Biblioteca para encriptar contraseñas.
# - ejs: Motor de plantillas para generar HTML dinámico.
# - express-session: Middleware para manejar sesiones en Express.


# ______________________________________ para mantener los paquetes actualizados_______________________________________
npm outdated
# para actualizarlos
npm update
# _____________________________________________________________________________________________________________________

#
npm install connect-flash
# Instala connect-flash, una biblioteca para mostrar mensajes flash (mensajes temporales) en aplicaciones Express.

#
npm install multer
# Instala multer, un middleware para manejar la subida de archivos en aplicaciones Express.
# Un middleware es una función en aplicaciones web que actúa como una capa intermedia entre la solicitud (request) del cliente y la respuesta (response) del servidor. En el contexto de Express.js, un middleware es una función que tiene acceso al objeto de solicitud (req), al objeto de respuesta (res) y a una función especial llamada next, que se utiliza para pasar el control al siguiente middleware en la pila.


# podemos crear los directorios con comando:
mkdir uploads
# Crea un directorio llamado "uploads" para almacenar archivos subidos.

# ejecutar el proyecto
node app.js


# scrip para crear al usuario administrador de la App ------
node scripts/createUser.js 123456 admin@gmail.com adminUser 25 admin123 admin
Esto creará un usuario con:

Identificación: 123456
Corre: admin@gmail.com
Username: adminUser
Edad: 25
Contraseña: admin123
Rol: admin
# -----------------------------------------------------------

# Crear admin fijo
node scripts/createAdmin.js

# ----------------------------------------------------------- 17 DE MAYO

# para generar el pdf
npm install pdfkit

# para descargar el csv
npm install json2csv


# para actualizar los paquetes del proyecto a última versión
npx npm-check-updates -u
npm install

# ----------------------------------------- 23 DE MAYO
npm install multer csv-parser

multer: para manejar la carga de archivos.
csv-parser: para leer archivos CSV en Node.js.