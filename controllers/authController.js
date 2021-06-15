const passport = require('passport');
const Usuario = require('../models/usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const { Sequelize } = require('../config/db');
const Op = Sequelize.Op;
const { findOne } = require('../models/usuarios');
const enviarEmail = require('../handlers/email.js');

exports.autenticarUsuario = passport.authenticate('local',{
 successRedirect:'/',
 failureRedirect:'/iniciar-sesion',
 failureFlash:true,
 badRequestMessage:'Ambos Campos son Obligatorios'

});



//Funcion para revisar si el usuario esta logueado o no
exports.usuarioAutenticado = (req,res,next) =>{
    //Si el usuario esta autenticado,adelante

    if(req.isAuthenticated()){
        return next();
    }

    //Sino esta autenticado,redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//Funcion para cerrar sesion
exports.cerrarSesion = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('iniciar-sesion'); // al cerrar sesion nos lleva al login
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async (req,resp)=>{
    //verifica que el usuario existe
    const usuario = await Usuario.findOne({where:{email:req.body.email}})

    //Si no existe el usuario
    if(!usuario){
        req.flash('error','No existe esa cuenta');
        resp.redirect('/reestablecer');
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //Guardar en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
   
    //Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject:'Password Reset',
        resetUrl,
        archivo:'reestablecer-password'

    });
    //termina la ejec
    req.flash('correcto','Se envio un mensaje a tu correo');
    resp.redirect('./iniciar-Sesion')
}

exports.validarToken = async(req,resp)=>{
       const usuario = await Usuario.findOne({where:{
           token:req.params.token
       }});
       //Si no encuenta el usuario
       if(!usuario){
           req.flash('error','No Valido');
           resp.redirect('/reestablecer');
       }

       //formulario para generar el password
       resp.render('resetPassword',{
           nombrePagina:'Reestablecer Contraseña'
       })
}

//Cambia el password por uno nuevo
exports.actualizarPassword = async(req,resp)=>{
    //console.log('ENTRE PARA ACTUALIZAR EL PASSWORD');
    //console.log('TOKEN DE USUARIO A CAMBIAR EL PASS',req.params.token);
    const usuario = await Usuario.findOne({where:{
        token:req.params.token,
        expiracion:{
            [Op.gte] :Date.now()
        }
    }})

    
//Verificamos si el usuario Existe
if(!usuario){
    req.flash('error','No Valido');
    resp.redirect('/reestablecer');
}

//hashear el password
    usuario.password=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    //Guardamos el nuevo pass
    await usuario.save();
    req.flash('correcto','Tu password se  ha modificado correctamente');
    resp.redirect('/iniciar-sesion')

   
}
