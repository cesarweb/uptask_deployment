const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo que vamos a autenticar
const Usuario = require('../models/usuarios.js');

//local strategy - login con credenciales propias
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField:'email',
            passwordField:'password'
        },
        async (email,password,done)=>{
           
             try {
                 const usuario = await Usuario.findOne(
                     {where:{
                         email,
                         activo:1
                        }
                    });
               
                 //El usuario existe pero el password puede ser incorrecto
                 if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message:'Password Incorrecto'
                    })
                 }
                 //El email y pass existen y son correctos
                 return done(null,usuario);
             } catch (error) {
                 //Ese usuario no existe
                 return done(null,false,{
                     message:'Esa cuenta no existe'
                 })
             }
        }
    )
);

// passport necesita serializar y deserializar al usuario

//serializar
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario);
})
//deserializar
passport.deserializeUser((usuario,callback)=>{
    callback(null,usuario);
})

module.exports = passport;