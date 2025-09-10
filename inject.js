(function() {
  let settings = {
    monitorWebSockets: true,
    monitorXHR: true,
    monitorFetch: true,
    maxCalls: 1000
  };
  
  function notifyExtension(apiCall) {
    window.postMessage({ type: 'WIRELENS_API_CALL', data: apiCall }, '*');
  }
  
  console.log('WireLens: Page script injected');
  
  // Listen for settings updates
  window.addEventListener('message', (event) => {
    if (event.data.type === 'WIRELENS_SETTINGS_UPDATE') {
      settings = event.data.settings;
    }
  });
  
  // Intercept XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    if (!settings.monitorXHR) return new originalXHR();
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    let requestData = {};
    
    xhr.open = function(method, url, ...args) {
      requestData = {
        id: Date.now() + Math.random(),
        method,
        url,
        timestamp: new Date().toISOString(),
        type: 'XHR'
      };
      return originalOpen.apply(this, [method, url, ...args]);
    };
    
    xhr.send = function(data) {
      requestData.requestBody = data;
      requestData.requestHeaders = {};
      
      xhr.addEventListener('loadend', () => {
        const apiCall = {
          ...requestData,
          status: xhr.status,
          statusText: xhr.statusText,
          responseHeaders: xhr.getAllResponseHeaders(),
          response: xhr.responseText,
          duration: Date.now() - new Date(requestData.timestamp).getTime()
        };
        
        console.log('WireLens: XHR captured', apiCall);
        notifyExtension(apiCall);
      });
      
      return originalSend.apply(this, arguments);
    };
    
    return xhr;
  };
  
  // Intercept Fetch API
  const originalFetch = window.fetch;
  window.fetch = function(input, init = {}) {
    if (!settings.monitorFetch) return originalFetch.apply(this, arguments);
    
    const url = typeof input === 'string' ? input : input.url;
    const method = init.method || 'GET';
    const startTime = Date.now();
    
    const requestData = {
      id: Date.now() + Math.random(),
      method,
      url,
      timestamp: new Date().toISOString(),
      type: 'Fetch',
      requestBody: init.body,
      requestHeaders: init.headers || {}
    };
    
    return originalFetch.apply(this, arguments)
      .then(response => {
        const apiCall = {
          ...requestData,
          status: response.status,
          statusText: response.statusText,
          duration: Date.now() - startTime
        };
        
        console.log('WireLens: Fetch captured', apiCall);
        notifyExtension(apiCall);
        
        return response;
      })
      .catch(error => {
        const apiCall = {
          ...requestData,
          status: 0,
          statusText: 'Network Error',
          error: error.message,
          duration: Date.now() - startTime
        };
        
        notifyExtension(apiCall);
        
        throw error;
      });
  };
})();