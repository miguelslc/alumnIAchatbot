function TEMPORARY_convertToUserDefinedResponse(event) {
  console.log(event);
  if (event.data.output.entities && event.data.output.entities[0]) {
    // Map over all items in the output array.
    event.data.output.generic = event.data.output.generic.map(function(item) {
      // If we find one that matches our convention to transform to user_defined response type, make the transformation.
      if (item.response_type === 'text' ){
        switch (item.text) {
          case 'esto es una prueba':
            item.response_type = 'esto es una prueba';
            item.user_defined = event.data.output.user_defined;
            delete item.text;
            break;  
          case 'certificado-generado':
          case 'Posgrado':
          case 'Laboratorio':
              console.log('entro en aulas');
              item.response_type = 'aula';
              item.user_defined = event.data.output.user_defined;
              delete item.text;
              break
        }
      }

      /* 
        * When we are done, the user_defined output should be in the shape below.
        * {
        *   "output": {
        *     "generic": [
        *       {
        *         "response_type": "user_defined",
        *         // You can add whatever custom variables you like inside the user_defined object.
        *         "user_defined": {
        *           // By convention, include the name of the template you want to display.
        *           "template_name": "foo"
        *         }
        *       }
        *     ]
        *   }
        * }
        */

      return item;
    });
  }
}

function customResponseHandler(event) {
  const { message } = event.data;

  // Add a switch so you can watch for different custom responses.
  // By convention, have a "template_name" property inside your user_defined object.
  switch (message.user_defined.template_name) {
    case 'color_box':
    case 'aulas_defined':
      handleColorBoxTemplate(event);
      break;
    default:
      console.error('Unhandled response type.');
  }
}

function handleColorBoxTemplate(event) {
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
      <button>Solicitar Confirmacion!</button> \
      </div>';

  

  element.querySelector('button').addEventListener('click', function addBackgroundColor(e) {

    var name = element.getElementsByTagName('input')[0].value;
    var email = element.getElementsByTagName('input')[1].value;
    console.log(name)
    console.log(email)
    var payload = {
      name: name,
      email: email,
      subject: 'Certificado de Asistencia a Examen',
      message: 'Certificado de Asistencia a Examen',
    };
    fetch("http://localhost:5000/api/send", {
      //fetch("https://glacial-reaches-90868.herokuapp.com/api/send", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(function(res){ return res.json(); })
      .then(function(data){ alert( JSON.stringify( data ) ) })
  });

  // Add our color picker inside the card.
  card.innerHTML = '<p style="margin-top:0;"><strong>Por Ultimo tu Nombre y Mail</strong></p>';
  card.appendChild(element);

  parent.appendChild(card);
  event.data.element.appendChild(parent);

  

}

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