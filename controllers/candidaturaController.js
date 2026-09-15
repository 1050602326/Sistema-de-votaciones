const Candidatura = require('../models/Candidatura'); // Importar el modelo de Candidatura
const User = require('../models/User'); // Importar el modelo de User
const Eleccion = require('../models/Eleccion'); // Importar el modelo de Elección
const UserProfile = require('../models/UserProfile'); // Importar el modelo de UserProfile

exports.showForm = async (req, res) => { // Mostrar el formulario para agregar candidatos a una elección
  const eleccionId = req.params.id;
  const eleccion = await Eleccion.findByPk(eleccionId);
  const candidatos = await User.findAll({ // Obtener todos los usuarios para mostrar en el formulario de selección en la opción "candidato" 
    where: { role: 'candidato' },
    include: [{ model: UserProfile }]
  });

  if (!eleccion) {
    req.flash('alert', '❌ Elección no encontrada.');
    return res.redirect('/elecciones');
  }

  const registros = await Candidatura.findAll({
    where: { eleccionId },
    include: [
      {
        model: User,
        include: [
          {
            model: UserProfile,
            required: false, // Si hay perfiles faltantes, igual mostrará los datos
            where: { }, // Opcional si se filtrar por algo específico
          }
        ]
      }
    ]
  });

  
  res.render('agregar_candidatos', {
    eleccion,
    candidatos,
    registros
  });
};
  

// Guardar candidatura
exports.create = async (req, res) => { // Procesar la creación de una candidatura
    const { eleccionId, userId, propuesta } = req.body;
  
    try {
      const palabras = propuesta.trim().split(/\s+/);
      if (palabras.length < 3) {
        req.flash('alert', '⚠️ La propuesta debe tener al menos 3 palabras.');
        return res.redirect(`/elecciones/${eleccionId}/candidatos`);
      }
  
      const existente = await Candidatura.findOne({
        where: { eleccionId, userId }
      });
  
      if (existente) {
        req.flash('alert', '⚠️ Este usuario ya está registrado como candidato en esta elección.');
        return res.redirect(`/elecciones/${eleccionId}/candidatos`);
      }
  
      await Candidatura.create({ eleccionId, userId, propuesta });
      req.flash('alert', '✅ Candidato agregado correctamente.');
  
    } catch (error) {
      console.error('❌ Error al agregar candidato:', error);
      req.flash('alert', '❌ Error al agregar el candidato.');
    }
  
    res.redirect(`/elecciones/${eleccionId}/candidatos`);
  };
  
  
  // Mostrar formulario de edición de propuesta con datos del candidato
exports.editForm = async (req, res) => {
  const candidatura = await Candidatura.findByPk(req.params.id, {
    include: [
      {
        model: User,
        include: [UserProfile] // Incluye datos del perfil
      },
      Eleccion
    ]
  });

  if (!candidatura) {
    req.flash('alert', '❌ Candidatura no encontrada.');
    return res.redirect('/elecciones');
  }

  res.render('editar_candidatura', { candidatura });
};

