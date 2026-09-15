const UserProfile = require('../models/UserProfile'); // Importar el modelo de UserProfile

exports.getProfile = async (req, res) => { // Mostrar el perfil del usuario
  if (!req.session.user) return res.redirect('/login');

  const userIdent = req.session.user.identificacion;
  let profile = await UserProfile.findOne({ where: { user_identificacion: userIdent } });

  if (!profile) {
    profile = await UserProfile.create({
      user_identificacion: userIdent,
      profile_picture: 'default.jpg'
    });
  }

  res.render('profile', { user: req.session.user, profile });
};

exports.updateProfile = async (req, res) => { // Actualizar el perfil del usuario
  const {
    bio,
    language_preference,
    notifications_enabled,
    birthdate,
    name,
    lastName,
    phone,
    address,
    gender
  } = req.body;
  const userIdent = req.session.user.identificacion;

  const updateData = {
    bio,
    language_preference,
    name,
    birthdate,
    lastName,
    phone,
    address,
    gender,
    notifications_enabled: notifications_enabled === 'on'
  };

  if (req.file) {
    updateData.profile_picture = req.file.filename;
  }

  await UserProfile.update(updateData, {
    where: { user_identificacion: userIdent }
  });

  res.redirect('/profile');
};