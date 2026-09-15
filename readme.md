# 🗳️ Sistema de Votaciones Web

<p align="center">
  <strong>Aplicación web de gestión de usuarios y procesos de votación</strong>
</p>

<p align="center">
  Proyecto académico desarrollado con <strong>Node.js, Express, Sequelize, MySQL y EJS</strong>.
</p>

---

## 📌 Descripción

**Sistema de Votaciones** es una aplicación web desarrollada como proyecto académico para implementar un sistema de autenticación, gestión de usuarios, perfiles y procesos relacionados con votaciones.

El proyecto utiliza una arquitectura basada en **Node.js + Express**, con **Sequelize** como ORM para la comunicación con **MySQL** y **EJS** para la generación de las interfaces web.

Entre sus principales funcionalidades se encuentran:

* 🔐 Registro e inicio de sesión de usuarios.
* 👤 Gestión de perfiles.
* 🛡️ Sistema de roles.
* 🔑 Autenticación mediante sesiones.
* 🔒 Contraseñas protegidas mediante `bcrypt`.
* 🖼️ Carga y gestión de imágenes de perfil.
* 🗄️ Persistencia de información mediante MySQL.
* 📄 Generación de archivos PDF.
* 📊 Exportación de información a CSV.
* 📥 Importación y procesamiento de archivos CSV.
* 💬 Mensajes temporales mediante `connect-flash`.

---

# 🚀 Tecnologías utilizadas

| Tecnología             | Uso                     |
| ---------------------- | ----------------------- |
| 🟢 **Node.js**         | Entorno de ejecución    |
| 🚂 **Express.js**      | Framework del servidor  |
| 🗄️ **MySQL**          | Base de datos           |
| 🔄 **Sequelize**       | ORM para MySQL          |
| 🎨 **EJS**             | Motor de plantillas     |
| 🔐 **bcrypt**          | Hash de contraseñas     |
| 🍪 **express-session** | Gestión de sesiones     |
| 💬 **connect-flash**   | Mensajes temporales     |
| 📤 **Multer**          | Carga de archivos       |
| 📄 **PDFKit**          | Generación de PDF       |
| 📊 **json2csv**        | Exportación a CSV       |
| 📥 **csv-parser**      | Lectura de archivos CSV |

---

# 🧩 Arquitectura del proyecto

```text
LOGIN-SYSTEM/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── profileController.js
│
├── middlewares/
│   └── upload.js
│
├── models/
│   ├── User.js
│   └── UserProfile.js
│
├── public/
│   └── style.css
│
├── routes/
│   ├── authRoutes.js
│   └── profileRoutes.js
│
├── scripts/
│   ├── createUser.js
│   └── createAdmin.js
│
├── uploads/
│   ├── default.jpg
│   └── *.jpg
│
├── views/
│   ├── dashboard.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── register.ejs
│
├── app.js
├── package.json
├── package-lock.json
├── readme.md
└── .gitignore
```

> `node_modules/` no se incluye en el repositorio porque las dependencias pueden instalarse automáticamente mediante `npm install`.

---

# ⚙️ Requisitos

Antes de ejecutar el proyecto debes tener instalado:

* [Node.js](https://nodejs.org/)
* [MySQL](https://www.mysql.com/)
* [Git](https://git-scm.com/)
* Un navegador web moderno.

También se recomienda utilizar **XAMPP** si deseas administrar MySQL mediante phpMyAdmin.

---

# 🗄️ Configuración de la base de datos

## 1. Iniciar MySQL

Si utilizas XAMPP:

1. Abre **XAMPP Control Panel**.
2. Inicia **MySQL**.
3. Opcionalmente inicia **Apache** para utilizar phpMyAdmin.

---

## 2. Crear la base de datos

Puedes acceder a phpMyAdmin desde:

```text
http://localhost/phpmyadmin/
```

Después ejecuta:

```sql
CREATE DATABASE login_db;
```

La aplicación utilizará esta base de datos para almacenar la información del sistema.

---

# 📦 Instalación

Clona el repositorio:

```bash
git clone https://github.com/1050602326/sistema-votaciones.git
```

Ingresa al proyecto:

```bash
cd sistema-votaciones
```

Instala las dependencias:

```bash
npm install
```

Esto instalará automáticamente las dependencias definidas en `package.json`.

---

# 📁 Dependencias principales

Si necesitas instalar manualmente las dependencias, puedes utilizar:

```bash
npm install express mysql2 sequelize bcrypt ejs express-session
```

Para mensajes temporales:

```bash
npm install connect-flash
```

Para carga de archivos:

```bash
npm install multer
```

Para generación de PDF:

```bash
npm install pdfkit
```

Para exportación de CSV:

```bash
npm install json2csv
```

Para procesamiento de archivos CSV:

```bash
npm install csv-parser
```

---

# ▶️ Ejecutar el proyecto

Una vez instaladas las dependencias y configurada la base de datos:

```bash
node app.js
```

El servidor se iniciará utilizando la configuración definida en `app.js`.

Después puedes acceder desde el navegador mediante la dirección indicada por el servidor.

---

# 👤 Crear usuario administrador

El proyecto incluye scripts para facilitar la creación de usuarios administrativos.

Ejemplo:

```bash
node scripts/createUser.js 123456 admin@gmail.com adminUser 25 admin123 admin
```

Los parámetros corresponden a:

| Parámetro      | Ejemplo           |
| -------------- | ----------------- |
| Identificación | `123456`          |
| Correo         | `admin@gmail.com` |
| Usuario        | `adminUser`       |
| Edad           | `25`              |
| Contraseña     | `admin123`        |
| Rol            | `admin`           |

> Los parámetros deben coincidir con la versión actual de `scripts/createUser.js`.

---

# 🛡️ Crear administrador predeterminado

También existe un script para crear un administrador fijo:

```bash
node scripts/createAdmin.js
```

Este comando ejecuta la lógica definida en el script para registrar el usuario administrador.

---

# 📊 Gestión de archivos CSV

El proyecto incorpora herramientas para trabajar con archivos CSV.

### Importar CSV

Se utiliza:

```bash
npm install csv-parser
```

`csv-parser` permite leer y procesar información almacenada en archivos CSV.

### Exportar CSV

Se utiliza:

```bash
npm install json2csv
```

Esto permite convertir información del sistema a archivos CSV.

---

# 📄 Generación de PDF

El sistema utiliza **PDFKit** para generar documentos PDF.

Instalación:

```bash
npm install pdfkit
```

Esta funcionalidad permite generar documentos a partir de la información gestionada por la aplicación.

---

# 🖼️ Gestión de imágenes

Las imágenes cargadas por los usuarios se almacenan en:

```text
uploads/
```

La aplicación utiliza **Multer** para procesar los archivos enviados mediante formularios.

La carpeta contiene una imagen predeterminada:

```text
uploads/default.jpg
```

y las imágenes cargadas por los usuarios.

---

# 🔐 Seguridad

El proyecto implementa diferentes mecanismos básicos de seguridad:

### Contraseñas

Las contraseñas son procesadas mediante:

```text
bcrypt
```

para evitar almacenarlas directamente como texto plano.

### Sesiones

La autenticación utiliza:

```text
express-session
```

para mantener las sesiones de los usuarios.

### Roles

El sistema permite diferenciar usuarios mediante roles, facilitando el control de acceso a determinadas funcionalidades.

---

# 🧱 Estructura de la aplicación

La aplicación está organizada siguiendo una separación básica de responsabilidades:

### `config/`

Contiene la configuración de servicios externos, principalmente la conexión con MySQL.

### `controllers/`

Contiene la lógica principal de la aplicación.

Ejemplos:

```text
authController.js
profileController.js
```

### `models/`

Define las entidades utilizadas por Sequelize:

```text
User.js
UserProfile.js
```

### `routes/`

Define las rutas HTTP disponibles en la aplicación.

### `middlewares/`

Contiene funciones intermedias utilizadas durante el procesamiento de las solicitudes.

### `views/`

Contiene las interfaces desarrolladas mediante EJS.

### `public/`

Contiene los recursos estáticos de la aplicación, como archivos CSS.

### `uploads/`

Almacena los archivos cargados por los usuarios.

### `scripts/`

Contiene scripts auxiliares para tareas administrativas, como la creación de usuarios.

---

# 🔄 Actualización de dependencias

Para consultar paquetes que tienen versiones nuevas:

```bash
npm outdated
```

Para actualizar las dependencias compatibles:

```bash
npm update
```

También puedes utilizar:

```bash
npx npm-check-updates -u
npm install
```

Esto permite actualizar las versiones especificadas en `package.json`.

---

# 🧪 Flujo básico de instalación

Si estás configurando el proyecto desde cero:

```bash
git clone https://github.com/1050602326/sistema-votaciones.git

cd sistema-votaciones

npm install
```

Crear la base de datos:

```sql
CREATE DATABASE login_db;
```

Después ejecutar:

```bash
node app.js
```

---

# 📌 Notas importantes

* `node_modules/` no debe subirse al repositorio.
* Las dependencias se restauran mediante `npm install`.
* La configuración de MySQL debe coincidir con la configuración definida en `config/db.js`.
* La carpeta `uploads/` puede contener imágenes generadas durante el uso de la aplicación.
* El proyecto fue desarrollado con fines **académicos y de aprendizaje**.

---

# 🎓 Objetivo académico

Este proyecto busca aplicar conocimientos relacionados con:

* Desarrollo backend.
* Desarrollo web con Node.js.
* Arquitectura MVC.
* Bases de datos relacionales.
* ORM mediante Sequelize.
* Autenticación de usuarios.
* Gestión de sesiones.
* Control de acceso mediante roles.
* Manejo de archivos.
* Procesamiento de información.
* Generación de documentos.
* Exportación e importación de datos.
* Uso de Git y GitHub.

---

# 🚧 Estado del proyecto

🟢 **Proyecto funcional / académico**

El sistema se encuentra en desarrollo como proyecto universitario y puede recibir nuevas funcionalidades, mejoras de interfaz, optimizaciones y refactorizaciones.

---

# 🔮 Posibles mejoras futuras

Algunas funcionalidades que pueden incorporarse posteriormente:

* [ ] Panel administrativo avanzado.
* [ ] Gestión completa de candidatos.
* [ ] Gestión de elecciones.
* [ ] Sistema completo de votación.
* [ ] Resultados estadísticos.
* [ ] Gráficas de resultados.
* [ ] Recuperación de contraseña.
* [ ] Validaciones avanzadas.
* [ ] Mejoras de seguridad.
* [ ] Variables de entorno mediante `.env`.
* [ ] Despliegue en un servidor.
* [ ] Documentación de API.
* [ ] Pruebas automatizadas.
* [ ] Diseño responsive mejorado.

---

# 👨‍💻 Autor

**Felipe Arias**

Proyecto académico desarrollado para fortalecer conocimientos en:

```text
Node.js
Express
JavaScript
MySQL
Sequelize
EJS
Git
GitHub
Desarrollo Web
```

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.

Puedes utilizar el código como referencia para aprendizaje y prácticas de desarrollo de software.
