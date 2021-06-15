const slug = require('slug');
const shortid = require('shortid');
const Sequelize = require('sequelize');
const db = require('../config/db');
const {INTEGER} = require('sequelize');

const proyectos = db.define('proyectos', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase()
            proyecto.url = `${url}-${
                shortid.generate()
            }`;
        }
    }
})

module.exports = proyectos;
