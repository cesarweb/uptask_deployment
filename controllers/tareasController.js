const {axios} = require('axios');
const Proyectos = require('../models/proyectos');
const Tareas = require('../models/tareas');
const tareas = require('../models/tareas');


exports.agregarTarea = async (req, resp, next) => {
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url
        }
    })

    // leer el valor del input
    const {tarea} = req.body;

    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la DB
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if (! resultado) {
        return next();
    }

    resp.redirect(`${
        req.params.url
    }`)
}

exports.cambiarEstadoTarea = async (req, resp, next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {
            id
        }})
    //cambiar estado 
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if(!resultado)return next();
    resp.status(200).send('Actualizado...')
}

exports.eliminarTarea=async(req,res,next)=>{
   const {id} =req.params;
   //Eliminar la tarea
   const resultado = await Tareas.destroy({where:{id}});

   if(!resultado){
       return next()
   }
    res.status(200).send('Tarea Eliminada correctamente');
}
