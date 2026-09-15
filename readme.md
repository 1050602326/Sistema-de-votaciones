# 🗳️ Sistema de Votaciones Web

<p align="center">
  <strong>Aplicación web de gestión de usuarios y procesos de votación</strong>
</p>

<p align="center">
  Proyecto académico desarrollado con <strong>Node.js, Express, Sequelize, MySQL y EJS</strong>.
</p>

---

## 📌 Descripción

**Sistema de Votaciones Web** es una aplicación desarrollada como proyecto académico para implementar un sistema de autenticación, gestión de usuarios, perfiles y funcionalidades relacionadas con procesos de votación.

El proyecto está construido sobre una arquitectura basada en **Node.js + Express**, utilizando **Sequelize** como ORM para la comunicación con **MySQL** y **EJS** como motor de plantillas para las interfaces web.

### ✨ Funcionalidades

* 🔐 Registro e inicio de sesión de usuarios.
* 👤 Gestión y edición de perfiles.
* 🛡️ Sistema de roles y permisos.
* 🔑 Autenticación mediante sesiones.
* 🔒 Protección de contraseñas mediante `bcrypt`.
* 🖼️ Carga y gestión de imágenes de perfil.
* 🗄️ Persistencia de datos mediante MySQL.
* 📄 Generación de documentos PDF.
* 📊 Exportación de información a CSV.
* 📥 Importación y procesamiento de archivos CSV.
* 💬 Mensajes temporales mediante `connect-flash`.

---

## 🚀 Tecnologías

| Tecnología             | Descripción                               |
| ---------------------- | ----------------------------------------- |
| 🟢 **Node.js**         | Entorno de ejecución para JavaScript      |
| 🚂 **Express.js**      | Framework para el desarrollo del servidor |
| 🗄️ **MySQL**          | Sistema de gestión de bases de datos      |
| 🔄 **Sequelize**       | ORM para trabajar con MySQL               |
| 🎨 **EJS**             | Motor de plantillas para las vistas       |
| 🔐 **bcrypt**          | Hash seguro de contraseñas                |
| 🍪 **express-session** | Gestión de sesiones                       |
| 💬 **connect-flash**   | Mensajes temporales                       |
| 📤 **Multer**          | Gestión de carga de archivos              |
| 📄 **PDFKit**          | Generación de documentos PDF              |
| 📊 **json2csv**        | Exportación de datos a CSV                |
| 📥 **csv-parser**      | Lectura y procesamiento de archivos CSV   |

---

## 🧩 Estructura del proyecto

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
├── README.md
└── .gitignore
```

> **Nota:** `node_modules/` no se incluye en el repositorio porque las dependencias pueden instalarse automáticamente mediante `npm install`.

---

## ⚙️ Requisitos

Antes de ejecutar el proyecto debes tener instalado:

* [Node.js](https://nodejs.org/)
* [MySQL](https://www.mysql.com/)
* [Git](https://git-scm.com/)
* Un navegador web moderno.

Se recomienda utilizar **XAMPP** para facilitar la administración de MySQL mediante phpMyAdmin.

---

## 🗄️ Configuración de MySQL

### 1. Iniciar MySQL

Si utilizas XAMPP:

1. Abre **XAMPP Control Panel**.
2. Inicia **MySQL**.
3. Inicia **Apache** si deseas utilizar phpMyAdmin.

### 2. Abrir phpMyAdmin

Accede desde:

http://localhost/phpmyadmin/

### 3. Crear la base de datos

Ejecuta:

```sql
CREATE DATABASE login_db;
```

La aplicación utilizará esta base de datos para almacenar la información del sistema.

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/1050602326/sistema-votaciones.git
```

### 2. Entrar al proyecto

```bash
cd sistema-votaciones
```

### 3. Instalar las dependencias

```bash
npm install
```

Este comando instalará automáticamente todas las dependencias definidas en `package.json`.

---

## 📁 Instalación de dependencias manual

Si necesitas instalar las dependencias individualmente:

### Dependencias principales

```bash
npm install express mysql2 sequelize bcrypt ejs express-session
```

### Connect Flash

```bash
npm install connect-flash
```

### Multer

```bash
npm install multer
```

### PDFKit

```bash
npm install pdfkit
```

### JSON2CSV

```bash
npm install json2csv
```

### CSV Parser

```bash
npm install csv-parser
```

> Normalmente no es necesario ejecutar estos comandos después de clonar el proyecto. `npm install` es suficiente si `package.json` contiene todas las dependencias.

---

## ▶️ Ejecutar la aplicación

Una vez configurada la base de datos e instaladas las dependencias:

```bash
node app.js
```

El servidor se iniciará utilizando la configuración definida en `app.js`.

Después abre en tu navegador la dirección indicada por el servidor.

---

## 👤 Crear un usuario administrador

El proyecto incluye un script para facilitar la creación de usuarios administrativos.

Ejemplo:

```bash
node scripts/createUser.js 123456 admin@gmail.com adminUser 25 admin123 admin
```

### Parámetros

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

## 🛡️ Crear administrador predeterminado

También existe un script para crear un administrador fijo:

```bash
node scripts/createAdmin.js
```

Este comando ejecuta la lógica definida dentro del script para registrar el usuario administrador.

---

## 🖼️ Gestión de imágenes

Las imágenes cargadas por los usuarios se almacenan en:

```text
uploads/
```

La aplicación utiliza **Multer** para procesar los archivos enviados mediante formularios.

La carpeta contiene una imagen predeterminada:

```text
uploads/default.jpg
```

También puede contener imágenes cargadas durante el uso de la aplicación.

---

## 🔐 Seguridad

El proyecto implementa diferentes mecanismos básicos de seguridad.

### Contraseñas

Las contraseñas son procesadas mediante:

```text
bcrypt
```

Esto permite almacenarlas mediante un hash en lugar de guardarlas directamente como texto plano.

### Sesiones

La autenticación utiliza:

```text
express-session
```

para mantener las sesiones de los usuarios.

### Roles

El sistema utiliza roles para diferenciar los tipos de usuario y controlar el acceso a determinadas funcionalidades.

---

## 📊 Gestión de archivos CSV

El proyecto incorpora funcionalidades para trabajar con archivos CSV.

### Importación

Para procesar archivos CSV se utiliza:

```bash
npm install csv-parser
```

`csv-parser` permite leer y procesar información almacenada en archivos CSV.

### Exportación

Para generar archivos CSV se utiliza:

```bash
npm install json2csv
```

`json2csv` permite convertir información del sistema a archivos CSV.

---

## 📄 Generación de PDF

El sistema utiliza **PDFKit** para generar documentos PDF.

Instalación:

```bash
npm install pdfkit
```

Esta funcionalidad permite generar documentos a partir de la información gestionada por la aplicación.

---

## 🏗️ Arquitectura de la aplicación

La aplicación sigue una separación básica de responsabilidades inspirada en el patrón **MVC**.

### `config/`

Contiene la configuración de servicios externos, principalmente la conexión con MySQL.

### `controllers/`

Contiene la lógica de negocio de la aplicación.

```text
authController.js
profileController.js
```

### `models/`

Contiene los modelos utilizados por Sequelize.

```text
User.js
UserProfile.js
```

### `routes/`

Contiene las rutas HTTP de la aplicación.

```text
authRoutes.js
profileRoutes.js
```

### `middlewares/`

Contiene funciones intermedias utilizadas durante el procesamiento de las solicitudes.

```text
upload.js
```

### `views/`

Contiene las interfaces desarrolladas utilizando EJS.

```text
dashboard.ejs
login.ejs
profile.ejs
register.ejs
```

### `public/`

Contiene los recursos estáticos de la aplicación, como archivos CSS.

### `uploads/`

Almacena las imágenes cargadas por los usuarios.

### `scripts/`

Contiene scripts auxiliares para tareas administrativas.

---

## 🔄 Actualización de dependencias

Para consultar las dependencias que tienen nuevas versiones:

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

---

## 🧪 Instalación rápida

Para configurar el proyecto desde cero:

```bash
git clone https://github.com/1050602326/sistema-votaciones.git
cd sistema-votaciones
npm install
```

Crear la base de datos:

```sql
CREATE DATABASE login_db;
```

Ejecutar la aplicación:

```bash
node app.js
```

---

## 📌 Notas importantes

* `node_modules/` no debe subirse al repositorio.
* Las dependencias se restauran mediante `npm install`.
* La configuración de MySQL debe coincidir con la configuración definida en `config/db.js`.
* La carpeta `uploads/` almacena las imágenes utilizadas por la aplicación.
* El proyecto fue desarrollado con fines **académicos y educativos**.
* La configuración actual está orientada a un entorno local de desarrollo.

---

## 🎓 Objetivo académico

Este proyecto busca aplicar y fortalecer conocimientos relacionados con:

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
* Importación y exportación de datos.
* Control de versiones con Git.
* Gestión de proyectos mediante GitHub.

---

## 🚧 Estado del proyecto

🟢 **Proyecto funcional / académico**

El sistema se encuentra en desarrollo como proyecto universitario y puede recibir nuevas funcionalidades, mejoras de interfaz, optimizaciones y refactorizaciones.

---

## 🔮 Mejoras futuras

* [ ] Panel administrativo avanzado.
* [ ] Gestión completa de candidatos.
* [ ] Gestión de elecciones.
* [ ] Sistema completo de votación.
* [ ] Resultados estadísticos.
* [ ] Gráficas de resultados.
* [ ] Recuperación de contraseña.
* [ ] Validaciones avanzadas.
* [ ] Mejoras de seguridad.
* [ ] Uso de variables de entorno mediante `.env`.
* [ ] Despliegue en un servidor.
* [ ] Documentación de API.
* [ ] Pruebas automatizadas.
* [ ] Diseño responsive mejorado.

---

## 👨‍💻 Autor

### Felipe Arias

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

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.

El código puede utilizarse como referencia para aprendizaje y prácticas de desarrollo de software.
