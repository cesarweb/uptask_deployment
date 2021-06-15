const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Proyectos = require('../models/proyectos');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
            notEmpty: {
                msg: 'El Email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya Registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo: {
        type:Sequelize.INTEGER,
        defaultValue:0

    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(Usuario) {
            Usuario.password = bcrypt.hashSync(Usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

// Metodos personalizados
Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);
module.exports = Usuarios;
