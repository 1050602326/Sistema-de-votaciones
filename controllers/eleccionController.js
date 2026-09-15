const Eleccion = require('../models/Eleccion'); // Importar el modelo de Elección
const Candidatura = require('../models/Candidatura'); // Importar el modelo de Candidatura
const Voto = require('../models/Voto'); // Importar el modelo de Voto
const User = require('../models/User');
const { Op } = require('sequelize');

// Mostrar formulario para crear nueva elección
exports.showForm = (req, res) => { // Verificar si el usuario tiene permisos de administrador
  res.render('crear_eleccion', { alert: null }); // Renderizar el formulario de creación de elección
};

// Procesar creación de elección
exports.create = async (req, res) => { // Procesar la creación de una nueva elección, si el usuario tiene permisos de administrador
    const { nombre, descripcion, tipo_representacion, fecha_inicio, fecha_fin } = req.body;
    const tiposValidos = ['facultad', 'semestre', 'comite'];
  
    try {
      if (!tiposValidos.includes(tipo_representacion)) {
        return res.render('crear_eleccion', {
          alert: '❌ Tipo de representación no válido.'
        });
      }
  
      if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        return res.render('crear_eleccion', {
          alert: '⚠️ La fecha de inicio debe ser anterior a la de fin.'
        });
      }
  
      await Eleccion.create({
        nombre,
        descripcion,
        tipo_representacion,
        fecha_inicio,
        fecha_fin,
        estado: 'programada'
      });
  
      res.redirect('/elecciones');
    } catch (error) {
      console.error('❌ Error al crear elección:', error);
      res.render('crear_eleccion', {
        alert: '❌ Error al crear la elección. Verifica los campos.'
      });
    }
  };

// Mostrar todas las elecciones registradas
exports.listAll = async (req, res) => {
  try {
const { busqueda, tipo_representacion } = req.query;

  const where = {};

  if (busqueda) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${busqueda}%` } },
      { descripcion: { [Op.like]: `%${busqueda}%` } },
      { tipo_representacion: { [Op.like]: `%${busqueda}%` } },
    ];
  }

  if (tipo_representacion) {
    where.tipo_representacion = tipo_representacion;
  }

  const elecciones = await Eleccion.findAll({
    where,
    order: [['fecha_inicio', 'DESC']]
  });

  res.render('listar_elecciones', {
    elecciones,
    currentEleccion: req.session.Eleccion,
    busqueda: busqueda || '',
    tipo_representacion: tipo_representacion || ''
  });
  } catch (error) {
    console.error('❌ Error al listar elecciones:', error);
    res.status(500).send('Error al listar elecciones');
  }
};


// Activar elección 
exports.activar = async (req, res) => { // Activar una elección programada, si el usuario tiene permisos de administrador
  const id = req.params.id;
  try {
    await Eleccion.update({ estado: 'activa' }, { where: { id } });
    req.flash('alert', '✅ Elección activada correctamente.');
  } catch (err) {
    req.flash('alert', '❌ No se pudo activar la elección.');
  }
  res.redirect('/elecciones');
};

// Finalizar elección
exports.finalizar = async (req, res) => { // Finalizar una elección activa, si el usuario tiene permisos de administrador
  const id = req.params.id;
  try {
    await Eleccion.update({ estado: 'finalizada' }, { where: { id } });
    req.flash('alert', '✅ Elección finalizada correctamente.');
  } catch (err) {
    req.flash('alert', '❌ No se pudo finalizar la elección.');
  }
  res.redirect('/elecciones');
};

// Eliminar elección junto con candidaturas y votos
exports.eliminar = async (req, res) => { // Eliminar una elección, candidaturas y votos asociados, si el usuario tiene permisos de administrador
  const id = req.params.id;
  try {
    await Voto.destroy({ where: { eleccionId: id } });
    await Candidatura.destroy({ where: { eleccionId: id } });
    await Eleccion.destroy({ where: { id } });

    req.flash('alert', '✅ Elección eliminada correctamente.');
  } catch (err) {
    console.error(err);
    req.flash('alert', '❌ No se pudo eliminar la elección.');
  }
  res.redirect('/elecciones');
};

// Cambiar estado manualmente (programada, activa, finalizada)
exports.cambiarEstado = async (req, res) => { // Cambiar el estado de una elección, si el usuario tiene permisos de administrador
  const { id } = req.params;
  const { nuevo_estado } = req.body;

  const estadosPermitidos = ['programada', 'activa', 'finalizada'];
  if (!estadosPermitidos.includes(nuevo_estado)) {
    req.flash('alert', '❌ Estado no válido.');
    return res.redirect('/elecciones');
  }

  try {
    const eleccion = await Eleccion.findByPk(id);
    if (!eleccion) {
      req.flash('alert', '❌ Elección no encontrada.');
      return res.redirect('/elecciones');
    }

    const ahora = new Date();

    if (nuevo_estado === 'activa' && new Date(eleccion.fecha_inicio) > ahora) {
      req.flash('alert', '⚠️ No puedes activar esta elección todavía. La fecha de inicio no ha llegado.');
      return res.redirect('/elecciones');
    }

    await Eleccion.update({ estado: nuevo_estado }, { where: { id } });
    req.flash('alert', `✅ Estado cambiado a "${nuevo_estado}" correctamente.`);

  } catch (error) {
    console.error('❌ Error al cambiar estado:', error);
    req.flash('alert', '❌ Error al cambiar el estado de la elección.');
  }

  res.redirect('/elecciones');
};

// Mostrar formulario de edición
exports.showEditForm = async (req, res) => { // Mostrar formulario para editar una elección, si el usuario tiene permisos de administrador
  const { id } = req.params;
  const eleccion = await Eleccion.findByPk(id);

  if (!eleccion) {
    req.flash('alert', '❌ Elección no encontrada.');
    return res.redirect('/elecciones');
  }

  res.render('editar_eleccion', { eleccion, alert: req.flash('alert')[0] });
};

// Procesar edición de elección
exports.update = async (req, res) => { // Procesar la edición de una elección, si el usuario tiene permisos de administrador
    const { id } = req.params;
    const { nombre, descripcion, tipo_representacion, fecha_inicio, fecha_fin } = req.body;
    const tiposValidos = ['facultad', 'semestre', 'comite'];
  
    try {
      if (!tiposValidos.includes(tipo_representacion)) {
        req.flash('alert', '❌ Tipo de representación no válido.');
        return res.redirect(`/elecciones/editar/${id}`);
      }
  
      if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        req.flash('alert', '⚠️ La fecha de inicio debe ser anterior a la fecha de fin.');
        return res.redirect(`/elecciones/editar/${id}`);
      }
  
      await Eleccion.update({
        nombre,
        descripcion,
        tipo_representacion,
        fecha_inicio,
        fecha_fin
      }, { where: { id } });
  
      req.flash('alert', '✅ Elección actualizada correctamente.');
      res.redirect('/elecciones');
    } catch (error) {
      console.error('❌ Error actualizando elección:', error);
      req.flash('alert', '❌ Error al actualizar la elección.');
      res.redirect(`/elecciones/editar/${id}`);
    }
  };
