// WireLens Content Script - API Interceptor
(function() {
  'use strict';

  const apiCalls = [];
  
  // Intercept XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
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
      
      xhr.addEventListener('loadend', () => {
        const apiCall = {
          ...requestData,
          status: xhr.status,
          statusText: xhr.statusText,
          responseHeaders: xhr.getAllResponseHeaders(),
          response: xhr.responseText,
          duration: Date.now() - new Date(requestData.timestamp).getTime()
        };
        
        apiCalls.push(apiCall);
        chrome.storage.local.set({ apiCalls });
      });
      
      return originalSend.apply(this, arguments);
    };
    
    return xhr;
  };
  
  // Intercept Fetch API
  const originalFetch = window.fetch;
  window.fetch = function(input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;
    const method = init.method || 'GET';
    const startTime = Date.now();
    
    const requestData = {
      id: Date.now() + Math.random(),
      method,
      url,
      timestamp: new Date().toISOString(),
      type: 'Fetch',
      requestBody: init.body
    };
    
    return originalFetch.apply(this, arguments)
      .then(response => {
        const apiCall = {
          ...requestData,
          status: response.status,
          statusText: response.statusText,
          duration: Date.now() - startTime
        };
        
        apiCalls.push(apiCall);
        chrome.storage.local.set({ apiCalls });
        
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
        
        apiCalls.push(apiCall);
        chrome.storage.local.set({ apiCalls });
        
        throw error;
      });
  };
  
  // Intercept WebSocket
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    const ws = new originalWebSocket(url, protocols);
    const startTime = Date.now();
    
    const requestData = {
      id: Date.now() + Math.random(),
      method: 'WebSocket',
      url,
      timestamp: new Date().toISOString(),
      type: 'WebSocket'
    };
    
    ws.addEventListener('open', () => {
      const apiCall = {
        ...requestData,
        status: 101,
        statusText: 'Switching Protocols',
        duration: Date.now() - startTime
      };
      
      apiCalls.push(apiCall);
      chrome.storage.local.set({ apiCalls });
    });
    
    ws.addEventListener('error', () => {
      const apiCall = {
        ...requestData,
        status: 0,
        statusText: 'WebSocket Error',
        duration: Date.now() - startTime
      };
      
      apiCalls.push(apiCall);
      chrome.storage.local.set({ apiCalls });
    });
    
    return ws;
  };
  
  // Set current tab ID and clear storage on page load
  chrome.runtime.sendMessage({ action: 'setTabId' });
  chrome.storage.local.set({ apiCalls: [] });
})();