window.watsonAssistantChatOptions = {
    integrationID: "9ea94948-b85a-424b-b665-29ee3a1d4469", // The ID of this integration.
    region: "us-south", // The region your integration is hosted in.
    serviceInstanceID: "2a90f5bc-a28a-43cf-98da-f9b62b6df51d", // The ID of your service instance.
    onLoad: function(instance) { instance.render(); }
  };
setTimeout(function(){
  const t=document.createElement('script');
  t.src="https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
  document.head.appendChild(t);
});