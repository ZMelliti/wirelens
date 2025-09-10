// WireLens Content Script - API Interceptor
(function() {
  'use strict';

  // Inject script into page context
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  
  (document.head || document.documentElement).appendChild(script);
  script.remove();
  
  // Listen for settings updates
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_UPDATED') {
      window.postMessage({ type: 'WIRELENS_SETTINGS_UPDATE', settings: message.settings }, '*');
    }
  });
  
  // Listen for messages from injected script
  window.addEventListener('message', (event) => {
    if (event.data.type === 'WIRELENS_API_CALL') {
      chrome.storage.local.get(['apiCalls'], (result) => {
        const apiCalls = result.apiCalls || [];
        apiCalls.push(event.data.data);
        
        chrome.storage.sync.get({ maxCalls: 1000 }, (settings) => {
          if (apiCalls.length > settings.maxCalls) {
            apiCalls.splice(0, apiCalls.length - settings.maxCalls);
          }
          chrome.storage.local.set({ apiCalls: apiCalls });
        });
        
        console.log('WireLens: API call stored', event.data.data);
      });
    }
  });
})();