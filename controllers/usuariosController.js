const Usuarios = require('../models/usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {nombrePagina: 'Crear Cuenta Uptask'})
}

exports.formIniciarSesion = (req, res) => {
   const {error} = res.locals.mensajes;
   res.render('iniciarSesion', {nombrePagina: 'Iniciar Sesion en Uptask',error})
}


exports.crearCuenta = async (req, res) => { // leer datos
    const {email, password} = req.body;
    try {
         // crea el Usuario
        await Usuarios.create({email, password});

        //crear una Url de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //Crear el objeto de usuario
        const usuario={
            email
        }

        //Enviar email
        await enviarEmail.enviar({
            usuario,
            subject:'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo:'confirmar-cuenta'
    
        });
        //redirigir al usuario
        req.flash('correcto','Enviamos un correo,confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password

        })
    }


}

exports.formRestablecerPassword=(req,res)=>{
    res.render('reestablecer',{
        nombrePagina:'Restablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async(req,res)=>{
    const usuario = await Usuarios.findOne({where:{
        email:req.params.correo
    }});
    
    if(!usuario){
        req.flash('error','No valido');
        res.redirect('/crear-cuenta');
    }
    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto','Cuenta Activada');
    res.redirect('/iniciar-sesion');
}
