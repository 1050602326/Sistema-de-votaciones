const Eleccion = require('../models/Eleccion'); // Importar el modelo de Elección
const Candidatura = require('../models/Candidatura'); // Importar el modelo de Candidatura
const User = require('../models/User'); // Importar el modelo de User
const UserProfile = require('../models/UserProfile'); // Importar el modelo de UserProfile
const Voto = require('../models/Voto'); // Importar el modelo de Voto

exports.verResultados = async (req, res) => { // Mostrar los resultados de las elecciones
  const elecciones = await Eleccion.findAll({
    include: {
      model: Candidatura,
      include: [
        {
          model: User,
          include: [UserProfile]
        },
        {
          model: Voto
        }
      ]
    },
    order: [['fecha_inicio', 'DESC']]
  });

  res.render('resultados', { elecciones });
};
