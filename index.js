const express = require('express');
const routes = require('./routes');
const path = require('path');
const helpers = require ('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//Importar variables
require('dotenv').config({path: 'variables.env'});


//Crea la Conexion a la BD
const db = require("./config/db");
//Importa el modelo
require("./models/proyectos");
require("./models/tareas");
require("./models/usuarios");



try {
  db.sync().then(console.log("BASE DE DATOS CONECTADA!"));
} catch (error) {
  console.log("ERROR EN LA BASE DE DATOS", error);
}

//crear una app de express
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// habilitar pug
app.set('view engine', 'pug');

// añadir la carpeta a las vistas
app.set('views', path.join(__dirname, './views'));
//Agregar Flash messages
app.use(flash());
app.use(cookieParser());

//sessiones nos permite navegar en distintas paginas sin volvernos a autentificar
app.use(session({
  secret:'supersecreto',
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session())

// var dump a la app
app.use((req,resp,next)=>{
  resp.locals.vardump = helpers.vardump;
  resp.locals.mensajes = req.flash();
  resp.locals.usuario = {...req.user} || null;
  next();
});



//ruta para el home
app.use('/', routes());
//Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT ||  3000;

app.listen(port,host,()=>{
  console.log('El servidor esta funcionado');
});

require('./handlers/email');
