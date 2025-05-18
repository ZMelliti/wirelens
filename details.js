// WireLens Details Script
document.addEventListener('DOMContentLoaded', function() {
  const backBtn = document.getElementById('backBtn');
  const requestInfo = document.getElementById('requestInfo');
  const requestHeaders = document.getElementById('requestHeaders');
  const requestBody = document.getElementById('requestBody');
  const responseHeaders = document.getElementById('responseHeaders');
  const responseBody = document.getElementById('responseBody');
  
  function formatJson(str) {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  }
  
  function loadApiCallDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const callId = urlParams.get('id');
    
    if (!callId) {
      window.location.href = 'popup.html';
      return;
    }
    
    chrome.storage.local.get(['apiCalls'], function(result) {
      const apiCalls = result.apiCalls || [];
      const apiCall = apiCalls.find(call => call.id.toString() === callId);
      
      if (!apiCall) {
        window.location.href = 'popup.html';
        return;
      }
      
      // Request Info
      requestInfo.innerHTML = `
        <div class="info-label">Method:</div>
        <div class="info-value">${apiCall.method}</div>
        <div class="info-label">URL:</div>
        <div class="info-value">${apiCall.url}</div>
        <div class="info-label">Status:</div>
        <div class="info-value">${apiCall.status} ${apiCall.statusText || ''}</div>
        <div class="info-label">Type:</div>
        <div class="info-value">${apiCall.type}</div>
        <div class="info-label">Duration:</div>
        <div class="info-value">${apiCall.duration}ms</div>
        <div class="info-label">Timestamp:</div>
        <div class="info-value">${new Date(apiCall.timestamp).toLocaleString()}</div>
      `;
      
      // Request Body
      if (apiCall.requestBody) {
        requestBody.textContent = formatJson(apiCall.requestBody);
      }
      
      // Response Headers
      if (apiCall.responseHeaders) {
        responseHeaders.textContent = apiCall.responseHeaders;
      }
      
      // Response Body
      if (apiCall.response) {
        responseBody.textContent = formatJson(apiCall.response);
      }
    });
  }
  
  backBtn.addEventListener('click', function() {
    window.location.href = 'popup.html';
  });
  
  loadApiCallDetails();
});