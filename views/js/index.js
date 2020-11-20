//entiendo que es una negrada declarar un objeto global
//mis conocimientos son limitados y no se como pasarlos para que se manejen 
//de manera local

//import { delete } from '../../routes/api/nodemailer.js';
import {templateCertificado} from './base64img.js';

const datoEnviar = {
  Carreras:'',
  Constancias:'',
  Materias:'',
  Aulas:'',
  Nombre:'',
  Email:'',
  Empresa:'',
  Modalidad:'',
  Tiempo:'',
  Sede: '',
  Dni: ''
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function TEMPORARY_convertToUserDefinedResponse(event) {
  if (event.data.output.entities && event.data.output.entities[0]) {
    switch (event.data.output.entities[0].entity) {
      case "Sedes":
        datoEnviar.Sede = event.data.output.entities[0].value;
        break
      case "Aulas":
        datoEnviar.Aulas = event.data.output.entities[0].value;
        break
      case "Carreras":
        datoEnviar.Carreras = event.data.output.entities[0].value;
        break
      case "Constancias":
        datoEnviar.Constancias = event.data.output.entities[0].value;
        break
      case "Materias":
        datoEnviar.Materias = event.data.output.entities[0].value;
        break
    }

    //Map over all items in the output array.+
    event.data.output.generic = event.data.output.generic.map((item) => {
      // If we find one that matches our convention to transform to user_defined response type, make the transformation.
      if (item.response_type === 'text' ){
        switch (item.text) {
          case 'direccion-sede':
            item.response_type = 'Direccion';
            item.user_defined = event.data.output.user_defined;
            delete item.text;
            break
          case 'Horarios':
            item.response_type = 'Horarios';
            item.user_defined = event.data.output.user_defined;
            delete item.text;
            break
          case 'Examenes':
            item.response_type = 'Examenes';
            item.user_defined = event.data.output.user_defined;
            delete item.text;
            break;  
          case 'certificado-generado':
          case 'Posgrado':
          case 'Laboratorio':
              item.response_type = 'aula';
              item.user_defined = event.data.output.user_defined;
              delete item.text;
              break
          case 'plan-estudio':
            item.response_type = 'Plan de Estudio';
            item.user_defined = event.data.output.user_defined;
            delete item.text;
        }
      }
      return item;
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function customResponseHandler(event) {
  const { message } = event.data;

  // Add a switch so you can watch for different custom responses.
  // By convention, have a "template_name" property inside your user_defined object.
  console.log('entro en customResponseHandler');
  console.log(message);
  switch (message.user_defined.template_name) {
    case 'sede_defined':
      handleSedeEvent(event);
      break
    case 'alumnoRegular_defined':
      handleCertificadoAlumnoRegularEvent(event);
      break
    case 'examenes_defined':
      handleExamenesEvent(event);
      break
    case 'trabajoCampo_defined':
      handleCertificadoTrabajoCampo(event);
      break
    case 'planEstudio_defined':
      handlePlanEstudioEvent(event);
      break
    case 'horarios_defined':
      handleHorariosEvent(event);
      break
    case 'aulas_defined':
      handleCertificadoExamenEvent(event);
      break;
    default:
      console.error('Unhandled response type.');
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleCertificadoExamenEvent(event) {
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = ' <div class="container"> \
      <input type="text" id="name" class="name" name="nombre" placeholder="Tu Nombre.."> \
      <input type="text" id="email" class="email" name="email" placeholder="Tu Mail.."> \
      <input type="text" id="empresa" class="empresa" name="empresa" placeholder="Lugar de Trabajo.."> \
      <button>Solicitar Confirmacion!</button> \
      </div>';

  element.querySelector('button').addEventListener('click', function addBackgroundColor(e) {
    datoEnviar.Nombre = element.getElementsByTagName('input')[0].value;
    datoEnviar.Email = element.getElementsByTagName('input')[1].value;
    datoEnviar.Empresa = element.getElementsByTagName('input')[2].value;

    datoEnviar.Tiempo = new Date();

    let date = new Date();
    
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let y = date.getFullYear();

    let payload = {
      name: datoEnviar.Nombre,
      email: datoEnviar.Email,
      subject: datoEnviar.Constancias,
      message: datoEnviar.Constancias,
      aula: datoEnviar.Aulas,
      carreras: datoEnviar.Carreras, 
      materias: datoEnviar.Materias,
      constancia: datoEnviar.Constancias,
      empresa: datoEnviar.Empresa,
      tiempo: datoEnviar.Tiempo,
      sede: datoEnviar.Sede,
      dni: datoEnviar.Dni
    };

    //fetch("http://localhost:5000/api/send/certificadoExamen", {
    fetch("https://alumnia-chatbot.herokuapp.com/api/send/certificadoExamen", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) { alert(JSON.stringify(data)) })

    var pdf = new jsPDF();

    pdf.addImage(templateCertificado, 'JPG', 0, 0, 200, 280);
    pdf.setFont("helvetica");
    pdf.setFontType("bold");
    pdf.setFontSize(10);

    pdf.text(72, 40, datoEnviar.Carreras);
    pdf.text(88, 50, 'SEDE  ' + datoEnviar.Sede);
    pdf.text(140, 85, `CABA ${d} de ${m} de ${y}`);

    pdf.text(20, 110, 'Por medio de la presente certificamos que el alumno : ' + datoEnviar.Nombre);
    pdf.text(20, 116, '( DNI : ' + datoEnviar.Dni + ' ) se encuentra cursando la ' + datoEnviar.Carreras);
    pdf.text(20, 122, 'y en el día de la fecha ha rendido parcial : ' + (datoEnviar.Modalidad || 'Virtual') + ' de la asignatura :' + datoEnviar.Materias );
    pdf.text(20, 128, 'Extendemos la presente constancia ante: ' + datoEnviar.Empresa);

    pdf.save(`Constancia de Examen - ${datoEnviar.Nombre}-${datoEnviar.Materias}.pdf`);
  });

  // Add our color picker inside the card.
  card.innerHTML = '<p style="margin-top:0;"><strong>Por Ultimo tu Nombre y Mail</strong></p>';
  card.appendChild(element);

  parent.appendChild(card);
  event.data.element.appendChild(parent);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleCertificadoTrabajoCampo(event) {
  console.log('ingreso en trabajo de campo')
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = ' <div class="container"> \
      <input type="text" id="name" class="name" name="nombre" placeholder="Tu Nombre y Apellido.."> \
      <input type="text" id="dni" class="dni" name="dni" placeholder="Tu Dni.."> \
      <input type="text" id="empresa" class="empresa" name="empresa" placeholder="Lugar de Trabajo.."> \
      <br/> \
      <button>Solicitar Confirmacion!</button> \
      </div>';

  element.querySelector('button').addEventListener('click', function addBackgroundColor(e) {
    datoEnviar.Nombre = element.getElementsByTagName('input')[0].value;
    datoEnviar.Dni = element.getElementsByTagName('input')[1].value;
    datoEnviar.Empresa = element.getElementsByTagName('input')[2].value;
    datoEnviar.Tiempo = new Date();

    let date = new Date();
    
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let y = date.getFullYear();

    let payload = {
      name: datoEnviar.Nombre,
      email: datoEnviar.Email,
      subject: datoEnviar.Constancias,
      message: datoEnviar.Constancias,
      aula: datoEnviar.Aulas,
      carreras: datoEnviar.Carreras, 
      materias: datoEnviar.Materias,
      constancia: datoEnviar.Constancias,
      empresa: datoEnviar.Empresa,
      tiempo: datoEnviar.Tiempo,
      sede: datoEnviar.Sede,
      dni: datoEnviar.Dni
    };
   /*  console.log(payload)
    fetch("http://localhost:5000/api/send/certificadoAlumnoRegular", {
    //fetch("https://alumnia-chatbot.herokuapp.com/api/send/certificadoAlumnoRegular", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) { alert(JSON.stringify(data)) }) */

    let pdf = new jsPDF();
    
    pdf.addImage(templateCertificado, 'JPG', 0, 0, 200, 280);
    pdf.setFont("helvetica");
    pdf.setFontType("bold");
    pdf.setFontSize(10);
    
    pdf.text(72, 40, datoEnviar.Carreras);
    pdf.text(88, 50, 'SEDE  ' + datoEnviar.Sede);
    pdf.text(140, 85, `CABA ${d} de ${m} de ${y}`);
    pdf.text(20, 110, 'Por medio de la presente certificamos que el alumno : ' + datoEnviar.Nombre);
    pdf.text(20, 116, '( DNI : ' + datoEnviar.Dni + ' ) en el marco de la ' + datoEnviar.Carreras);
    pdf.text(20, 122, 'se encuentra realizando un trabajo de campo para : ' + datoEnviar.Materias);
    pdf.text(20, 128, 'Extendemos la presente constancia ante: ' + datoEnviar.Empresa);

    pdf.save(`Constancia de Trabajo de Campo - ${datoEnviar.Nombre}-${datoEnviar.Materias}.pdf`);

  });

  // Add our color picker inside the card.
  card.innerHTML = '<p style="margin-top:0;"><strong>Por Ultimo tu Nombre y Apellido, Mail y Tu Lugar de Trabajo</strong></p>';
  card.appendChild(element);

  parent.appendChild(card);
  event.data.element.appendChild(parent);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleCertificadoAlumnoRegularEvent(event) {
  
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = ' <div class="container"> \
      <input type="text" id="name" class="name" name="nombre" placeholder="Tu Nombre y Apellido.."> \
      <input type="text" id="dni" class="dni" name="dni" placeholder="Tu Dni.."> \
      <input type="text" id="empresa" class="empresa" name="empresa" placeholder="Lugar de Trabajo.."> \
      <br/> \
      <button>Solicitar Confirmacion!</button> \
      </div>';

  element.querySelector('button').addEventListener('click', function addBackgroundColor(e) {
    datoEnviar.Nombre = element.getElementsByTagName('input')[0].value;
    datoEnviar.Dni = element.getElementsByTagName('input')[1].value;
    datoEnviar.Empresa = element.getElementsByTagName('input')[2].value;
    datoEnviar.Tiempo = new Date();

    let date = new Date();
    
    let m = (date.getMonth() + 1).toString().padStart(2, "0");
    let d = date.getDate().toString().padStart(2, "0");
    let y = date.getFullYear();

    let payload = {
      name: datoEnviar.Nombre,
      email: datoEnviar.Email,
      subject: datoEnviar.Constancias,
      message: datoEnviar.Constancias,
      aula: datoEnviar.Aulas,
      carreras: datoEnviar.Carreras, 
      materias: datoEnviar.Materias,
      constancia: datoEnviar.Constancias,
      empresa: datoEnviar.Empresa,
      tiempo: datoEnviar.Tiempo,
      sede: datoEnviar.Sede,
      dni: datoEnviar.Dni
    };
   /*  console.log(payload)
    fetch("http://localhost:5000/api/send/certificadoAlumnoRegular", {
    //fetch("https://alumnia-chatbot.herokuapp.com/api/send/certificadoAlumnoRegular", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(function (res) { return res.json(); })
    .then(function (data) { alert(JSON.stringify(data)) }) */

    let pdf = new jsPDF();
    
    pdf.addImage(templateCertificado, 'JPG', 0, 0, 200, 280);
    pdf.setFont("helvetica");
    pdf.setFontType("bold");
    pdf.setFontSize(10);

    pdf.text(72, 40, datoEnviar.Carreras);
    pdf.text(88, 50, 'SEDE  ' + datoEnviar.Sede);
    pdf.text(140, 85, `CABA ${d} de ${m} de ${y}`);

    pdf.text(20, 110, 'Por medio de la presente certificamos que el alumno : ' + datoEnviar.Nombre);
    pdf.text(20, 116, '( DNI : ' + datoEnviar.Dni + ' ) se encuentra cursando la ' + datoEnviar.Carreras);
    pdf.text(20, 122,  'Extendemos la presente constancia ante: ' + datoEnviar.Empresa);

    pdf.save(`Constancia Alumno Regular - ${datoEnviar.Nombre}.pdf`);

  });

  // Add our color picker inside the card.
  card.innerHTML = '<p style="margin-top:0;"><strong>Por Ultimo tu Nombre y Apellido, Mail y Tu Lugar de Trabajo</strong></p>';
  card.appendChild(element);

  parent.appendChild(card);
  event.data.element.appendChild(parent);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handlePlanEstudioEvent(event) {
  const { message } = event.data;
  console.log(message);
  switch (message.user_defined.context.carreras) {
    case 'Lic. En Gestion de la Informacion':
      var PDF = 'https://drive.google.com/file/d/1KS9U1G9fbiDjHSnMhOuSZdoCnD2ylWdN/view?usp=sharing';
      break
    case 'Lic. En Higiene y Seguridad en el Trabajo':
      var PDF = ' https://drive.google.com/file/d/1IbW1Dio1CEOIHHqc1NeWwz6jIp8bv2qF/view?usp=sharing';
      break
    case 'Tec. En Programacion de Computadoras':
      var PDF = 'https://drive.google.com/file/d/1rKF9nFSqNxVo3fUh97yTEOmMQCDyyB0g/view?usp=sharing';
      break
    case 'Esp. en Ingeniería Ambiental y Desarrollo Sostenible':
      var PDF = 'https://drive.google.com/file/d/1OHRQIYDzLfx1b4f41ug1mWXyBzbZqhUl/view?usp=sharing';
      break
    case 'Tec. en Implementación y Gestión Informática':
      var PDF = 'https://drive.google.com/file/d/1J3L2poN6wJcaNKqocM3jaygOgtrEB9F8/view?usp=sharing';
      break
    case 'Lic. en Gestión de Sistemas de Automación y Robótica':
      var PDF = 'https://drive.google.com/file/d/1J3L2poN6wJcaNKqocM3jaygOgtrEB9F8/view?usp=sharing';
      break;
    default:
      console.error('Unhandled response type.');
  }
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
   // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = 
       '<div class="container">\
          <a href='+`${PDF}`+' target="_blank">Plan de Estudio</a>\
       </div>';
  card.appendChild(element);
  parent.appendChild(card);
  event.data.element.appendChild(parent);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleExamenesEvent(event) {
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = 
       '<div class="container">\
          <a href="https://drive.google.com/file/d/1TKUBDno2BFCPgI5FfMnBWp-QCFgShDQM/view?usp=sharing" target="_blank">Examenes</a>\
       </div>';

  card.appendChild(element);
  parent.appendChild(card);
  event.data.element.appendChild(parent);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleSedeEvent(event) {
  const parent = document.createElement('div');

  //Don Bosco 3729, C1206ABG

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%;');
  let sedeCaba = '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.6700123669243!2d-58.420458384770015!3d-34.61250498045722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca5f4f04cf0b%3A0x710eb7645618a25a!2sDon%20Bosco%203729%2C%20C1206%20ABG%2C%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1605219706259!5m2!1ses-419!2sar"';
  let sedeLomas = '"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.1695839538174!2d-58.45933378429316!3d-34.776505880414966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcd2192e981fe7%3A0x4926bfc663d3eee8!2sFacultad%20de%20Ingenier%C3%ADa%20Universidad%20Nacional%20de%20Lomas%20de%20Zamora!5e0!3m2!1ses-419!2sar!4v1605221257139!5m2!1ses-419!2sar"';
  
  let sede = (datoEnviar.Sede == "CABA") ? sedeCaba : sedeLomas;
  
  element.innerHTML = 
  '<div class="google-maps"> \
    <iframe src='+`${sede}`+' \
      width="200" \
      height="200" \
      frameborder="0" \
      style="border:0;" \
      allowfullscreen="" \
      aria-hidden="false" \
      tabindex="0">\
    </iframe>\
  </div>';

  card.appendChild(element);
  parent.appendChild(card);
  event.data.element.appendChild(parent);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleHorariosEvent(event) {
  const parent = document.createElement('div');

  // Create a element with the 'ibm-web-chat-card' class we will add our content to.
  // This class makes the element look like one of the cards used in web chat.
  const card = document.createElement('div');
  card.classList.add('ibm-web-chat-card');

  const element = document.createElement('div');
  
  element.setAttribute('style', 'width:100%; height:100%; text-align: left;');
  element.innerHTML = 
       '<div class="container">\
          <a href="https://drive.google.com/file/d/1l03tbJrb-6EhZQksEggmdsz0tF0DL38-/view?usp=sharing" target="_blank">Horarios</a>\
       </div>';
  card.appendChild(element);
  parent.appendChild(card);
  event.data.element.appendChild(parent);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.watsonAssistantChatOptions = {
    integrationID: "9ea94948-b85a-424b-b665-29ee3a1d4469", // The ID of this integration.
    region: "us-south", // The region your integration is hosted in.
    serviceInstanceID: "2a90f5bc-a28a-43cf-98da-f9b62b6df51d", // The ID of your service instance.

    showLauncher: false,
    onLoad: function(instance) {
      // Temporary: Subscribe to the "pre:receive" event to convert to the user_defined response_type.
      instance.on({ type: 'pre:receive', handler: TEMPORARY_convertToUserDefinedResponse });
      
      // Watch for the customResponse event to handle the user defined response type.
      instance.on({ type: 'customResponse', handler: customResponseHandler });

      // Select the button element from the page.
      const button = document.querySelector('.chatLauncher');
  
      // Add the event listener to open your web chat.
      button.addEventListener('click', function clickListener() {
        instance.openWindow();
      });
  
      // Render the web chat. Nothing appears on the page, because the launcher is
      // hidden and the web chat window is closed by default.
      instance.render().then(function() {
        // Now that web chat has been rendered (but is still closed), we make the
        // custom launcher button visible.
        button.style.display = 'block';
        button.classList.add('open');
      });
    }
  };
setTimeout(function(){
  const t=document.createElement('script');
  t.src="https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
  document.head.appendChild(t);
});
