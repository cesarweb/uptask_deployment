const Sequelize = require('sequelize');
const db = require('../config/db');
const {sequelize} = require('./proyectos');
const Proyectos = require('./proyectos');
const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER
})
Tareas.belongsTo(Proyectos); //Relaciona las tablas

module.exports = Tareas;
