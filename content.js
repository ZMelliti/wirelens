// WireLens Content Script - API Interceptor
(function() {
  'use strict';

  // Inject script into page context
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('inject.js');
  
  (document.head || document.documentElement).appendChild(script);
  script.remove();
  
  // Listen for messages from injected script
  window.addEventListener('message', (event) => {
    if (event.data.type === 'WIRELENS_API_CALL') {
      chrome.storage.local.get(['apiCalls'], (result) => {
        const apiCalls = result.apiCalls || [];
        apiCalls.push(event.data.data);
        chrome.storage.local.set({ apiCalls: apiCalls });
        console.log('WireLens: API call stored', event.data.data);
      });
    }
  });
})();