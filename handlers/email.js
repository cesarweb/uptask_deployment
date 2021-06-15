const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text')
const util = require('util');
const emailConfig = require('../config/email');


let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  const generarHTML = (archivo,opciones={}) =>{
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`,opciones);
      return juice(html);
  }

  exports.enviar = async (opciones)=>{
      const html = generarHTML(opciones.archivo,opciones);
      const text =htmlToText.fromString(html) 
      let opcionesEmail={
        from: 'Uptask <no-reply@uptask.com>', // sender address
        to: opciones.usuario.email, // list of receivers
        subject:opciones.subject, // Subject line
        text, // plain text body
        html, // html body
      }
      const enviarEmail = util.promisify(transporter.sendMail,transporter);
        return enviarEmail.call(transporter,opcionesEmail);
  };

 
