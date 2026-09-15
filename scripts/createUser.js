const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const User = require('../models/User');

async function createUser() {
  const args = process.argv.slice(2);

  if (args.length !== 6) {
    console.log(
      '❗ Uso: node scripts/createUser.js <identificacion> <correo> <username> <edad> <password> <role> '
    );
    return process.exit(1);
  }

  const [
    identificacion,
    correo,
    username, 
    edad,
    password,
    role
   
  ] = args;

  // Roles permitidos
  const validRoles = [
    'admin',
    'administrativo',
    'candidato',
    'votante'
  ];

  if (!validRoles.includes(role)) {
    console.log(
      `❌ Rol inválido. Opciones válidas: ${validRoles.join(', ')}`
    );
    return process.exit(1);
  }

  // Validar edad
  const edadNumero = Number(edad);

  if (!Number.isInteger(edadNumero) || edadNumero < 18) {
    console.log('❌ La edad debe ser un número entero mayor o igual a 18.');
    return process.exit(1);
  }

  // Validar correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(correo)) {
    console.log('❌ El correo electrónico no tiene un formato válido.');
    return process.exit(1);
  }

  try {
    await sequelize.sync();

    // Validar identificación + rol
    const idRoleExists = await User.findOne({
      where: {
        identificacion,
        role
      }
    });

    if (idRoleExists) {
      console.log(
        `❌ Ya existe un usuario con identificación ${identificacion} y rol ${role}.`
      );
      return process.exit(1);
    }

    // Validar username
    const userExists = await User.findOne({
      where: {
        username
      }
    });

    if (userExists) {
      console.log(
        `❌ El nombre de usuario '${username}' ya está en uso.`
      );
      return process.exit(1);
    }

    // Validar correo
    const emailExists = await User.findOne({
      where: {
        correo
      }
    });

    if (emailExists) {
      console.log(
        `❌ El correo '${correo}' ya está registrado.`
      );
      return process.exit(1);
    }

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario
    await User.create({
      identificacion,
      correo,
      username,
      edad: edadNumero,
      password_hash: hash,
      role
    });

    console.log(`
========================================
✅ USUARIO CREADO CON ÉXITO
========================================
Usuario:         ${username}
Identificación:  ${identificacion}
Correo:          ${correo}
Edad:            ${edadNumero}
Rol:             ${role}
========================================
`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    process.exit(1);
  }
}

createUser();