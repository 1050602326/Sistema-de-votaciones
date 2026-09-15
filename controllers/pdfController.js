const PDFDocument = require('pdfkit'); // Importar la librería pdfkit para generar PDFs
const fs = require('fs'); // Importar el módulo fs para trabajar con el sistema de archivos
const path = require('path'); // Importar el módulo path para trabajar con rutas de archivos

const Eleccion = require('../models/Eleccion'); // Importar el modelo de Elección
const Candidatura = require('../models/Candidatura'); // Importar el modelo de Candidatura
const User = require('../models/User'); // Importar el modelo de User
const UserProfile = require('../models/UserProfile'); // Importar el modelo de UserProfile
const Voto = require('../models/Voto'); // Importar el modelo de Voto

exports.descargarResultadosPDF = async (req, res) => { // Generar un PDF con los resultados de una elección
  const eleccionId = req.params.id;
  const eleccion = await Eleccion.findByPk(eleccionId);
  const resultados = await Candidatura.findAll({
    where: { eleccionId },
    include: [
      { model: User, include: [UserProfile] },
      { model: Voto }
    ]
  });

  if (!eleccion) return res.status(404).send('Elección no encontrada');

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const fecha = new Date().toLocaleDateString('es-CO');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=resultados_eleccion_${eleccionId}.pdf`);
  doc.pipe(res);

  // Logo institucional
  const logoPath = path.join(__dirname, '../public/img/logo_usta.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 40, { width: 60 });
  }

  // Encabezado principal
  doc.fontSize(20).fillColor('#000').text('Historial de Resultados', 0, 50, { align: 'center' });
  doc.fontSize(12).fillColor('gray').text('Sistema de Votación Electrónica - USTA', { align: 'center' });
  doc.moveDown(2);

  const startX = 40;

  // Datos de la elección con estilo
  doc
    .fontSize(13)
    .fillColor('#003366')
    .font('Helvetica-Bold')
    .text('Elección:', startX, doc.y);

  doc
    .fontSize(13)
    .fillColor('#000')
    .font('Helvetica')
    .text(` ${eleccion.nombre}`, startX + 65, doc.y - 15);

  doc
    .moveDown(0.3)
    .fontSize(12)
    .fillColor('#003366')
    .font('Helvetica-Bold')
    .text('Estado:', startX, doc.y);

  doc
    .fontSize(12)
    .fillColor('#000')
    .font('Helvetica')
    .text(` ${eleccion.estado.toUpperCase()}`, startX + 50, doc.y - 15);

  doc.moveDown(0.5);

  // Línea decorativa
  doc
    .strokeColor('#CCCCCC')
    .lineWidth(1)
    .moveTo(startX, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown(1);

  // Encabezado de tabla
  const startY = doc.y + 10;
  const columnWidths = [180, 240, 80];

  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#ffffff')
    .rect(startX, startY, columnWidths.reduce((a, b) => a + b), 20)
    .fill('#003366')
    .fillColor('#ffffff')
    .text('Candidato', startX + 5, startY + 5)
    .text('Propuesta', startX + columnWidths[0] + 5, startY + 5)
    .text('Votos', startX + columnWidths[0] + columnWidths[1] + 5, startY + 5);

  let currentY = startY + 20;

  const maxVotos = Math.max(...resultados.map(c => c.Votos.length));
  const ganadores = resultados.filter(c => c.Votos.length === maxVotos && maxVotos > 0);

  for (let i = 0; i < resultados.length; i++) {
    const c = resultados[i];
    const nombre = `${c.User.UserProfile?.nombres || ''} ${c.User.UserProfile?.apellidos || ''}`.trim();
    const propuesta = c.propuesta || 'N/A';
    const votos = c.Votos.length;
    const isGanador = votos === maxVotos && maxVotos > 0;

    doc
      .fillColor('#000000')
      .font('Helvetica')
      .fontSize(10);

    if (isGanador) {
      doc.rect(startX, currentY, columnWidths.reduce((a, b) => a + b), 20).fill('#d4edda');
      doc.fillColor('#000000');
    }

    doc.text(`${nombre} (@${c.User.username})`, startX + 5, currentY + 5, { width: columnWidths[0] - 10 });
    doc.text(propuesta, startX + columnWidths[0] + 5, currentY + 5, { width: columnWidths[1] - 10 });
    doc.text(`${votos}`, startX + columnWidths[0] + columnWidths[1] + 5, currentY + 5);

    currentY += 20;
    doc.fillColor('#000'); // Reset
  }

  doc.moveDown(1);

  // Leyenda
  doc
  .moveDown(0.5)
  .fontSize(9)
  .fillColor('gray')
  .text('* El candidato resaltado en verde obtuvo la mayor cantidad de votos.', startX, doc.y, {
    width: 500,
    align: 'justify',
  });


  // Línea divisoria + pie de página en todas las páginas
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);

    // Línea horizontal decorativa
    doc
      .moveTo(40, 770)
      .lineTo(555, 770)
      .strokeColor('#cccccc')
      .lineWidth(0.5)
      .stroke();

    // Pie institucional y paginación
    doc
      .fontSize(9)
      .fillColor('gray')
      .text(`Generado por el Sistema de Votación FIS- USTA - Tunja, ${fecha}`, 40, 780, { align: 'left' })
      .text(`Página ${i + 1} de ${pageCount}`, 40, 780, { align: 'right' });
  }

  doc.end();
};

const { Parser } = require('json2csv');

exports.descargarResultadosCSV = async (req, res) => { // Generar un CSV con los resultados de una elección
  const eleccionId = req.params.id;
  const eleccion = await Eleccion.findByPk(eleccionId);
  const resultados = await Candidatura.findAll({
    where: { eleccionId },
    include: [
      { model: User, include: [UserProfile] },
      { model: Voto }
    ]
  });

  if (!eleccion) return res.status(404).send('Elección no encontrada');

  const datosCSV = resultados.map(c => ({
    Candidato: `${c.User.UserProfile?.nombres || ''} ${c.User.UserProfile?.apellidos || ''}`.trim(),
    Usuario: c.User.username,
    Propuesta: c.propuesta || 'N/A',
    Votos: c.Votos.length
  }));

  const parser = new Parser({ fields: ['Candidato', 'Usuario', 'Propuesta', 'Votos'] });
  const csv = parser.parse(datosCSV);

  const bom = '\uFEFF'; // BOM for UTF-8
  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment(`resultados_eleccion_${eleccionId}.csv`);
  res.send(bom + csv); // prepend BOM
};
