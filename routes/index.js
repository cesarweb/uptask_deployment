const express = require('express');
const router = express.Router();
// Express-validator
const {body} = require('express-validator');


const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');



module.exports = function () {
    router.get('/',
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
    
    );

    router.get('/nosotros',
    proyectosController.proyectosNosotros);

    router.get('/nuevoProyecto',
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto);

    router.post('/nuevoProyecto', body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto);

    // Listar proyectos
    router.get('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.proyectoPorUrl);

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado,
    proyectosController.formularioEditar);

    router.post('/nuevoProyecto/:id', body('nombre').not().isEmpty().trim().escape(), proyectosController.actualizarProyecto);

    // Eliminar Proyecto
    router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.eliminarProyecto);

    // Tareas
    router.post('/proyectos/:url', 
    authController.usuarioAutenticado,
    tareasController.agregarTarea);

    // Actualizar Tarea
    router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea);

    // Eliminar Tarea
    router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea);

    // Crear  cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);


    //Iniciar Sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer  contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token',authController.actualizarPassword);









    return router;
}
