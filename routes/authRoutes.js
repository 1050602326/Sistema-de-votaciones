const express = require('express'); // Importar express
const router = express.Router(); // Crear un nuevo router
const authController = require('../controllers/authController'); // Importar el controlador de autenticación
const User = require('../models/User');
const UserProfile = require('../models/UserProfile'); // Importar el modelo de perfil de usuario
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const uploadCsv = require('../middlewares/uploadCSV'); // Importar el middleware de multer para subir archivos CSV
const fs = require('fs'); // Importar el módulo fs para manejar archivos de sistema 
const csv = require('csv-parser');  // Importar el módulo csv-parser para leer archivos CSV


// ---------------------------------
// MIDDLEWARES
// ---------------------------------

function onlyAdmin(req, res, next) { // Solo admin puede acceder a esta ruta
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/dashboard');
}

function redirectIfAuthenticated(req, res, next) { // Si ya está autenticado, redirigir a dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
}

function ensureAuthenticated(req, res, next) { // Asegurarse de que el usuario esté autenticado
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// ---------------------------------
// AUTENTICACIÓN
// ---------------------------------

router.get('/login', redirectIfAuthenticated, authController.showLogin); // Mostrar formulario de login
router.post('/login', redirectIfAuthenticated, authController.login);    // Procesar login
router.get('/logout', authController.logout);                            // Cerrar sesión
router.get('/dashboard', ensureAuthenticated, authController.dashboard); // Mostrar dashboard

// ---------------------------------
// REGISTRO (solo accesible por admin)
// ---------------------------------

router.get('/register', onlyAdmin, authController.showRegister);  // Mostrar formulario de registro
router.post('/register', onlyAdmin, authController.register);     // Procesar registro


router.get('/admin/users', onlyAdmin, async (req, res) => { // Mostrar lista de usuarios
  const { busqueda, rol } = req.query;
  const where = {};

  if (busqueda) {
    where[Op.or] = [
      { username: { [Op.like]: `%${busqueda}%` } },
      { identificacion: { [Op.like]: `%${busqueda}%` } }
    ];
  }

  if (rol) {
    where.role = rol;
  }

  const users = await User.findAll({
    where,
    order: [['role', 'ASC']]
  });

  res.render('admin_users', {
    users,
    currentUser: req.session.user,
    busqueda: busqueda || '',
    rol: rol || ''
  });
  
});

router.post('/admin/users/delete/:id', onlyAdmin, async (req, res) => { // Eliminar usuario
  const userId = parseInt(req.params.id);
  const currentUserId = req.session.user.id;

  if (userId === currentUserId) {
    req.flash('alert', '⚠️ No puedes eliminar tu propia cuenta de administrador.');
    const users = await User.findAll({ order: [['role', 'ASC']] });
    return res.render('admin_users', {
      users,
      currentUser: req.session.user,
      busqueda: '',
      rol: ''
    });
  }

  const userToDelete = await User.findByPk(userId);
  if (userToDelete.role === 'admin') {
    req.flash('alert', '⚠️ No puedes eliminar a otros usuarios con rol admin.');
    const users = await User.findAll({ order: [['role', 'ASC']] });
    return res.render('admin_users', {
      users,
      currentUser: req.session.user,
      busqueda: '',
      rol: ''
    });
  }

  await User.destroy({ where: { id: userId } });
  req.flash('alert', '✅ Usuario eliminado correctamente.');
  res.redirect('/admin/users');
});



router.post('/admin/users/edit/:id', onlyAdmin, async (req, res) => { // Editar usuario
  const { identificacion, username } = req.body;
  const userId = parseInt(req.params.id);
  const trimmedUsername = username.trim().toLowerCase();

  try {
    if (/\s/.test(trimmedUsername)) {
      req.flash('alert', '⚠️ El nombre de usuario no debe contener espacios.');
      const users = await User.findAll({ order: [['role', 'ASC']] });
      return res.render('admin_users', {
        users,
        currentUser: req.session.user,
        busqueda: '',
        rol: ''
      });
    }

    const usernameExists = await User.findOne({
      where: {
        username: trimmedUsername,
        id: { [Op.ne]: userId }
      }
    });

    if (usernameExists) {
      req.flash('alert', '⚠️ El nombre de usuario ya está en uso por otro usuario.');
      const users = await User.findAll({ order: [['role', 'ASC']] });
      const alert = req.flash('alert')[0]; 
      return res.render('admin_users', {
        users,
        currentUser: req.session.user,
        busqueda: '',
        rol: '',
        alert 
      });
    }

    
    const userToEdit = await User.findByPk(userId);
    const identRoleExists = await User.findOne({
      where: {
        identificacion,
        role: userToEdit.role,
        id: { [Op.ne]: userId }
      }
    });

    if (identRoleExists) {
      req.flash('alert', '⚠️ Ya existe otro usuario con la misma identificación y rol.');
      const users = await User.findAll({ order: [['role', 'ASC']] });
      return res.render('admin_users', {
        users,
        currentUser: req.session.user,
        busqueda: '',
        rol: ''
      });
    }

    await User.update({ identificacion, username: trimmedUsername }, { where: { id: userId } });
    req.flash('alert', '✅ Usuario actualizado correctamente.');
    res.redirect('/admin/users');

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    req.flash('alert', '❌ Error al actualizar el usuario.');
    const users = await User.findAll({ order: [['role', 'ASC']] });
    return res.render('admin_users', {
      users,
      currentUser: req.session.user,
      busqueda: '',
      rol: ''
    });
  }
});




router.post('/admin/users/delete/:id', onlyAdmin, async (req, res) => { // Eliminar usuario
  const userId = parseInt(req.params.id);
  const currentUserId = req.session.user.id;

  // No puede eliminarse a sí mismo
  if (userId === currentUserId) {
    req.flash('alert', '⚠️ No puedes eliminar tu propia cuenta de administrador.');
    return res.redirect('/admin/users');
  }

  // Obtener el usuario a eliminar
  const userToDelete = await User.findByPk(userId); // Si no existe, redirigir a la lista de usuarios
  if (userToDelete.role === 'admin') {
    req.flash('alert', '⚠️ No puedes eliminar a otros usuarios con rol admin.');
    return res.redirect('/admin/users');
  }

  await User.destroy({ where: { id: userId } });
  req.flash('alert', '✅ Usuario eliminado correctamente.');
  res.redirect('/admin/users');
});


router.get('/admin/users/edit/:id', onlyAdmin, async (req, res) => { // Esto sirve para mostrar el formulario de edición de usuario
  const user = await User.findByPk(req.params.id);
  if (!user) return res.redirect('/admin/users');

  const alert = req.flash('alert')[0]; 
  res.render('edit_user', { user, alert }); 
});


router.post('/admin/users/edit/:id', onlyAdmin, async (req, res) => { // y este sirve para procesar el formulario de edición de usuario
  const { identificacion, username } = req.body;
  const userId = parseInt(req.params.id);
  const trimmedUsername = username.trim().toLowerCase();

  try {
    if (/\s/.test(trimmedUsername)) {
      req.flash('alert', '⚠️ El nombre de usuario no debe contener espacios.');
      return res.redirect(`/admin/users/edit/${userId}`);
    }

    const usernameExists = await User.findOne({
      where: {
        username: trimmedUsername,
        id: { [Op.ne]: userId }
      }
    });

    if (usernameExists) {
      req.flash('alert', '⚠️ El nombre de usuario ya está en uso por otro usuario.');
      const users = await User.findAll({ order: [['role', 'ASC']] });
      const alert = req.flash('alert')[0]; 
      return res.render('admin_users', {
        users,
        currentUser: req.session.user,
        busqueda: '',
        rol: '',
        alert 
      });
    }
    

    const userToEdit = await User.findByPk(userId);
    const identRoleExists = await User.findOne({
      where: {
        identificacion,
        role: userToEdit.role,
        id: { [Op.ne]: userId }
      }
    });

    if (identRoleExists) {
      req.flash('alert', '⚠️ Ya existe otro usuario con la misma identificación y rol.');
      return res.redirect(`/admin/users/edit/${userId}`);
    }

    await User.update({ identificacion, username: trimmedUsername }, { where: { id: userId } });
    req.flash('alert', '✅ Usuario actualizado correctamente.');
    res.redirect('/admin/users');

  } catch (error) {
    console.error('❌ Error actualizando usuario:', error);
    req.flash('alert', '❌ Error al actualizar el usuario.');
    res.redirect('/admin/users');
  }
});

// ---------------------------------
// MI CUENTA (todos los roles autenticados)
// ---------------------------------


router.get('/miCuenta', ensureAuthenticated, (req, res) => { // en este caso no se necesita el middleware de admin, porque todos los roles pueden acceder a esta ruta;
  const user = req.session.user; // Obtener el usuario de la sesión
   const alert = req.flash('alert')[0]; // Obtener el mensaje de alerta, si existe
  res.render('miCuenta', { user, alert }); // Renderizar la vista mi_cuenta con el usuario y la alerta 
});
router.get('/mi-cuenta', ensureAuthenticated, async (req, res) => { // en este caso no se necesita el middleware de admin, porque todos los roles pueden acceder a esta ruta
  const user = await User.findByPk(req.session.user.id);
  const alert = req.flash('alert')[0]; 
  res.render('mi_cuenta', { user, alert }); 
});


router.post('/mi-cuenta', ensureAuthenticated, async (req, res) => { // acá se procesa el formulario de edición de cuenta para los usuarios autenticados de cualquier rol
  const { identificacion, username } = req.body;
  const userId = req.session.user.id;
  const trimmedUsername = username.trim().toLowerCase();

  if (/\s/.test(trimmedUsername)) {
    req.flash('alert', '⚠️ El nombre de usuario no debe contener espacios.');
    return res.redirect('/mi-cuenta');
  }

  const usernameExists = await User.findOne({
    where: { username: trimmedUsername, id: { [Op.ne]: userId } }
  });

  if (usernameExists) {
    req.flash('alert', '⚠️ El nombre de usuario ya está en uso.');
    return res.redirect('/mi-cuenta');
  }

  const currentUser = await User.findByPk(userId);

  const identRoleExists = await User.findOne({
    where: {
      identificacion,
      role: currentUser.role,
      id: { [Op.ne]: userId }
    }
  });

  if (identRoleExists) {
    req.flash('alert', '⚠️ Ya existe otro usuario con la misma identificación y rol.');
    return res.redirect('/mi-cuenta');
  }

  await User.update({ identificacion, username: trimmedUsername }, { where: { id: userId } });


    const updatedUser = await User.findByPk(userId); // Obtener el usuario actualizado

    req.session.user = updatedUser; // Actualizar la sesión con los nuevos datos del usuario


  req.flash('alert', '✅ Datos actualizados correctamente.');
  res.redirect('/mi-cuenta');
});

// ---------------------------------
// CAMBIAR CONTRASEÑA PERSONAL
// ---------------------------------

router.get('/cambiar-contrasena', ensureAuthenticated, (req, res) => { // acá se muestra el formulario de cambio de contraseña para los usuarios autenticados de cualquier rol
  const alert = req.flash('alert')[0]; 
  res.render('cambiar_contrasena', { alert }); 
});


router.post('/cambiar-contrasena', ensureAuthenticated, async (req, res) => { // acá se procesa el formulario de cambio de contraseña para los usuarios autenticados de cualquier rol
  const { actual, nueva, confirmar } = req.body;
  const user = await User.findByPk(req.session.user.id);

  const valid = await bcrypt.compare(actual, user.password_hash);
  if (!valid) {
    req.flash('alert', '⚠️ La contraseña actual es incorrecta.');
    return res.render('cambiar_contrasena', { user, alert: req.flash('alert')[0] });
}



  if (nueva !== confirmar) {
    req.flash('alert', '⚠️ La nueva contraseña no coincide con la confirmación.');
    return res.render('cambiar_contrasena', { user, alert: req.flash('alert')[0] });
  }

  const newHash = await bcrypt.hash(nueva, 10);
  await User.update({ password_hash: newHash }, { where: { id: user.id } });

  req.flash('alert', '✅ Contraseña actualizada correctamente.');
  return res.render('cambiar_contrasena', { user, alert: req.flash('alert')[0] });

});

// ---------------------------------
// CAMBIAR CONTRASEÑA DE OTRO USUARIO (ADMIN)
// ---------------------------------

router.get('/admin/users/password/:id', onlyAdmin, async (req, res) => { // esta ruta le aplica a cualquier usuario autenticado, pero el middleware solo permite a los admin acceder a ella
  const user = await User.findByPk(req.params.id);
  if (!user) return res.redirect('/admin/users');

  const alert = req.flash('alert')[0]; 
  res.render('editar_password_usuario', { user, alert }); 
});



router.post('/admin/users/password/:id', onlyAdmin, async (req, res) => { // esta ruta le aplica a cualquier usuario autenticado, pero el middleware solo permite a los admin acceder a ella
  const { nueva, confirmar } = req.body;
  const userId = parseInt(req.params.id);

  // Buscar el usuario para poder reenviarlo si hay error
  const user = await User.findByPk(userId);
  if (!user) return res.redirect('/admin/users');

  // Si no coinciden las contraseñas, quedarse en la misma vista
  if (nueva !== confirmar) {
    req.flash('alert', '⚠️ Las contraseñas no coinciden.');
    return res.render('editar_password_usuario', { user, alert: req.flash('alert')[0] });
  }

  const hash = await bcrypt.hash(nueva, 10);
  await User.update({ password_hash: hash }, { where: { id: userId } });

  req.flash('alert', '✅ Contraseña actualizada exitosamente.');
  res.redirect('/admin/users');
});

// --------------------------------- para subir CSV
router.post('/admin/users/upload-csv', onlyAdmin, uploadCsv.single('csvfile'), async (req, res) => {
  if (!req.file) {
    req.flash('alert', '⚠️ No se ha proporcionado un archivo CSV.');
    return res.redirect('/admin/users');
  }

  const usersToCreate = [];
  const errores = [];
  const rolesPermitidos = ['administrativo', 'candidato', 'votante'];

  const fs = require('fs');
  const csv = require('csv-parser');
  const bcrypt = require('bcrypt');

  fs.createReadStream(req.file.path)
    .pipe(csv({
      mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '') 
    }))
    .on('data', (row) => {
      const { identificacion, username, password, role } = row;

      if (!identificacion || !username || !password || !rolesPermitidos.includes(role)) {
        errores.push(`Fila inválida: ${JSON.stringify(row)}`);  
        return;
      }

      usersToCreate.push({
        identificacion,
        username: username.trim().toLowerCase(),
        password,
        role
      });
    })
    .on('end', async () => {
  const resultados = [];
  for (const user of usersToCreate) {
    const exists = await User.findOne({ where: { identificacion: user.identificacion, role: user.role } });
    const userExists = await User.findOne({ where: { username: user.username } });

    if (!exists && !userExists) {
      const hash = await bcrypt.hash(user.password, 10);
      await User.create({
        identificacion: user.identificacion,
        username: user.username,
        password_hash: hash,
        role: user.role
      });
      resultados.push(`✅ ${user.username} creado`);
    } else {
      errores.push(`❌ ${user.username} ya existe o está duplicado`);
    }
  }

  const resumen = [...resultados, ...errores].join('<br>');
  req.flash('alert', resumen);
  res.redirect('/admin/users');
});

});


router.get('/miPerfil', ensureAuthenticated, async (req, res) => { // Mostrar perfil del usuario autenticado
  
 try {
  
  const user = await User.findByPk(req.session.user.id);
   if (!user) {
     req.flash('alert', '⚠️ Usuario no encontrado.');
     return res.redirect('/login');
   }

   const profile = await UserProfile.findOne({ where: { user_identificacion: user.identificacion } });

   const isEmpty = val => !val || val.toString().trim() === '';


    const incompleto = !profile || [
      profile.birthdate,
      profile.name,
      profile.lastName,
      profile.phone,
      profile.gender,
      profile.address,
      profile.bio,
      profile.language_preference
        ].some(isEmpty);

        if (incompleto) {
          req.flash('alert', '⚠️ Debes completar tu perfil antes de continuar.');
          return res.redirect('/profile');
        }

        const alert = req.flash('alert')[0];
        res.render('miPerfil', { user, profile, alert });

 } catch (error) {
   console.error('❌ Error al mostrar el perfil:', error);
 }


});




module.exports = router; // Exportar el router para usarlo en el servidor principal que es app.js
