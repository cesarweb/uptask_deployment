const Proyectos = require('../models/proyectos');
const Tareas = require('../models/tareas');


exports.proyectosHome = async (req, res) => {
    const usuarioId=res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}
exports.proyectosNosotros = (req, res) => {
    res.render('nosotros');
};

exports.formularioProyecto = async (req, res) => {
    const proyectos = await Proyectos.findAll();
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
};
exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId=res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectoPromise, proyectoPromise]);
    // Consultar Tareas del Proyecto Actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {
                model: Proyectos
            }
        ]
    })
    if (!proyecto) 
        return next();
    


    res.render('tareas', {
            nombrePagina: `Tareas del Proyecto - ${
            proyecto.nombre
        }`,
        proyecto,
        proyectos,
        tareas
    })
};

exports.formularioEditar = async (req, res) => {
    const usuarioId=res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId=res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const {nombre} = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un Nombre al Proyecto'});
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: `Nuevo Proyecto`,
            errores,
            proyectos

        })
    } else {
        try {
            const usuarioId=res.locals.usuario.id;
            const proyecto = await Proyectos.create({nombre,usuarioId});
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }


    }
};

exports.actualizarProyecto = async (req, res) => {
    const usuarioId=res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where:{usuarioId}});
    const {nombre} = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agregar un Nombre al Proyecto'});
    }

    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: `Nuevo Proyecto`,
            errores,
            proyectos

        })
    } else {
        try {
            await Proyectos.update({
                nombre
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }


    }
};

exports.eliminarProyecto = async (req, res, next) => {
    const {url} = req.params;
    const resultado = await Proyectos.destroy({
        where: {
            url: url
        }
    })
    if (! resultado) {
        return next();
    }
    res.status(200).send('Proyecto Eliminado Correctamente');


}
