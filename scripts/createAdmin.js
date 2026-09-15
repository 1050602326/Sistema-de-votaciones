const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  try {
    // Conectar y sincronizar la base de datos
    await sequelize.sync();

    // Datos del administrador
    const admin = {
      identificacion: '1050603',
      correo: 'admin@example.com',
      username: 'admin',
      edad: 30,
      password: '1234',
      role: 'admin'
    };

    // Verificar identificación + rol
    const existingUser = await User.findOne({
      where: {
        identificacion: admin.identificacion,
        role: admin.role
      }
    });

    if (existingUser) {
      console.log(
        `❌ Ya existe un usuario con identificación ${admin.identificacion} y rol ${admin.role}.`
      );
      return;
    }

    // Verificar username
    const existingUsername = await User.findOne({
      where: {
        username: admin.username
      }
    });

    if (existingUsername) {
      console.log(
        `❌ El nombre de usuario '${admin.username}' ya está en uso.`
      );
      return;
    }

    // Verificar correo
    const existingEmail = await User.findOne({
      where: {
        correo: admin.correo
      }
    });

    if (existingEmail) {
      console.log(
        `❌ El correo '${admin.correo}' ya está registrado.`
      );
      return;
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(admin.password, 10);

    // Crear administrador
    await User.create({
      identificacion: admin.identificacion,
      correo: admin.correo,
      username: admin.username,
      edad: admin.edad,
      password_hash: passwordHash,
      role: admin.role
    });

    console.log(`
========================================
✅ ADMINISTRADOR CREADO CORRECTAMENTE
========================================
Usuario:        ${admin.username}
Identificación: ${admin.identificacion}
Correo:         ${admin.correo}
Edad:           ${admin.edad}
Rol:            ${admin.role}
========================================
`);

  } catch (error) {
    console.error('❌ Error al crear el administrador:', error);
  } finally {
    // Cerrar conexión con la base de datos
    await sequelize.close();
  }
}

createAdmin();