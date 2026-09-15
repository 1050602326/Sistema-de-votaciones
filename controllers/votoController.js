const Eleccion = require('../models/Eleccion'); // Importar el modelo de Elección
const Candidatura = require('../models/Candidatura'); // Importar el modelo de Candidatura
const User = require('../models/User'); // Importar el modelo de User
const UserProfile = require('../models/UserProfile'); // Importar el modelo de UserProfile
const Voto = require('../models/Voto'); // Importar el modelo de Voto

exports.listarEleccionesActivas = async (req, res) => { // Mostrar las elecciones activas
  const elecciones = await Eleccion.findAll({
    where: { estado: 'activa' },
    order: [['fecha_inicio', 'DESC']]
  });
  res.render('votante_elecciones', { elecciones });
};

exports.verCandidatos = async (req, res) => { // Mostrar los candidatos de una elección
  const eleccionId = req.params.id;
  const eleccion = await Eleccion.findByPk(eleccionId);
  const yaVoto = await Voto.findOne({
    where: { userId: req.session.user.id, eleccionId }
  });

  const candidatos = await Candidatura.findAll({
    where: { eleccionId },
    include: [{
      model: User,
      include: [UserProfile]
    }]
  });

  res.render('votar', { eleccion, candidatos, yaVoto });
};

exports.emitirVoto = async (req, res) => { // Procesar el voto emitido por el usuario
  const { eleccionId, candidaturaId } = req.body;
  try {
    await Voto.create({
      userId: req.session.user.id,
      eleccionId,
      candidaturaId
    });
    req.flash('alert', '✅ Voto registrado correctamente.');
  } catch (error) {
    req.flash('alert', '❌ Ya has votado en esta elección.');
  }
  res.redirect('/votar/elecciones');
};

exports.verResultadosEleccion = async (req, res) => { // Mostrar los resultados de una elección específica
    const eleccionId = req.params.id;
    const eleccion = await Eleccion.findByPk(eleccionId);
  
    const resultados = await Candidatura.findAll({
      where: { eleccionId },
      include: [
        {
          model: User,
          include: [UserProfile]
        },
        {
          model: Voto
        }
      ]
    });
  
    res.render('resultados_eleccion', { eleccion, resultados });
  };

  exports.misVotos = async (req, res) => { // Mostrar los votos emitidos por el usuario y sus detalles
    const votos = await Voto.findAll({
      where: { userId: req.session.user.id },
      include: [
        {
          model: Eleccion
        },
        {
          model: Candidatura,
          include: [
            {
              model: User,
              include: [UserProfile]
            }
          ]
        }
      ]
    });
  
    res.render('mis_votos', { votos });
  };
  