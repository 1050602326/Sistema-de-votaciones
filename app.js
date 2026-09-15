const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const eleccionRoutes = require('./routes/eleccionRoutes');
const candidaturaRoutes = require('./routes/candidaturaRoutes');
const votoRoutes = require('./routes/votoRoutes'); // ruta para votaciones
const resultadosRoutes = require('./routes/resultadosRoutes');


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  const alert = req.flash('alert')[0] || null;
  res.locals.alert = alert;

  if (alert) {
    if (alert.startsWith('✅')) {
      res.locals.alertClass = 'alert-success';
    } else if (alert.startsWith('⚠️')) {
      res.locals.alertClass = 'alert-warning';
    } else if (alert.startsWith('❌')) {
      res.locals.alertClass = 'alert-danger';
    } else {
      res.locals.alertClass = 'alert-info';
    }
  } else {
    res.locals.alertClass = '';
  }

  req.user = req.session.user || null;
  res.locals.user = req.user;


  next();
});

// ✅ Registrar todas las rutas
app.use(authRoutes);
app.use(profileRoutes);
app.use(eleccionRoutes);
app.use(candidaturaRoutes);
app.use(votoRoutes); // para votaciones ya que se ha creado la ruta votoRoutes
app.use(resultadosRoutes); // para resultados de votaciones


app.get('/', (req, res) => {
  res.render('index');
});


sequelize.sync().then(() => {
  app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
});
