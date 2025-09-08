// WireLens Details Script
document.addEventListener('DOMContentLoaded', function() {
  const backBtn = document.getElementById('backBtn');
  
  // Tab functionality
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabName + '-panel').classList.add('active');
    });
  });
  
  // Header search functionality
  const headerSearch = document.getElementById('headerSearch');
  if (headerSearch) {
    headerSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const headerBlocks = document.querySelectorAll('#headers-panel .code-block');
      
      headerBlocks.forEach(block => {
        const lines = block.innerHTML.split('\n');
        const filteredLines = lines.filter(line => 
          line.toLowerCase().includes(searchTerm)
        );
        if (searchTerm) {
          block.innerHTML = filteredLines.join('\n');
        }
      });
    });
  }
  
  // JSON formatter
  let isFormatted = false;
  const formatBtn = document.getElementById('formatBtn');
  if (formatBtn) {
    formatBtn.addEventListener('click', () => {
      const responseBody = document.getElementById('responseBody');
      const content = responseBody.textContent;
      
      if (!isFormatted) {
        responseBody.innerHTML = formatJson(content);
        formatBtn.textContent = 'Raw';
        isFormatted = true;
      } else {
        responseBody.textContent = content;
        formatBtn.textContent = 'Format JSON';
        isFormatted = false;
      }
    });
  }
  
  function formatJson(str) {
    try {
      const parsed = JSON.parse(str);
      return JSON.stringify(parsed, null, 2)
        .replace(/"([^"]+)":/g, '<span class="json-key">"$1":</span>')
        .replace(/: "([^"]+)"/g, ': <span class="json-string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
        .replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>');
    } catch {
      return str;
    }
  }
  
  function getMethodColor(method) {
    const colors = {
      'GET': 'linear-gradient(45deg, #00d4aa, #00b894)',
      'POST': 'linear-gradient(45deg, #6c5ce7, #a29bfe)',
      'PUT': 'linear-gradient(45deg, #fd79a8, #e84393)',
      'DELETE': 'linear-gradient(45deg, #e17055, #d63031)',
      'PATCH': 'linear-gradient(45deg, #fdcb6e, #e17055)',
      'WebSocket': 'linear-gradient(45deg, #74b9ff, #0984e3)'
    };
    return colors[method] || '#666';
  }
  
  function getStatusColor(status) {
    if (status >= 200 && status < 300) return '#00b894';
    if (status >= 300 && status < 400) return '#fdcb6e';
    if (status >= 400 && status < 500) return '#e17055';
    if (status >= 500) return '#d63031';
    return '#666';
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
      
      // Update header summary
      const methodBadge = document.getElementById('methodBadge');
      const statusBadge = document.getElementById('statusBadge');
      const urlText = document.getElementById('urlText');
      
      methodBadge.textContent = apiCall.method;
      methodBadge.style.background = getMethodColor(apiCall.method);
      
      statusBadge.textContent = apiCall.status;
      statusBadge.style.color = getStatusColor(apiCall.status);
      statusBadge.style.background = `${getStatusColor(apiCall.status)}20`;
      
      urlText.textContent = new URL(apiCall.url).pathname;
      
      // Overview panel
      document.getElementById('requestInfo').innerHTML = `
        <div class="info-label">Method:</div>
        <div class="info-value">${apiCall.method}</div>
        <div class="info-label">URL:</div>
        <div class="info-value">${apiCall.url}</div>
        <div class="info-label">Status:</div>
        <div class="info-value">${apiCall.status} ${apiCall.statusText || ''}</div>
        <div class="info-label">Type:</div>
        <div class="info-value">${apiCall.type}</div>
        <div class="info-label">Timestamp:</div>
        <div class="info-value">${new Date(apiCall.timestamp).toLocaleString()}</div>
      `;
      
      // Timing visualization
      const maxDuration = 2000; // 2 seconds max for visualization
      const percentage = Math.min((apiCall.duration / maxDuration) * 100, 100);
      document.getElementById('timingFill').style.width = percentage + '%';
      document.getElementById('durationText').textContent = apiCall.duration + 'ms';
      
      // Headers panel with counts
      const reqHeaders = apiCall.requestHeaders || {};
      const reqHeadersHtml = Object.keys(reqHeaders).length > 0 ? 
        Object.entries(reqHeaders).map(([key, value]) => 
          `<span class="json-key">${key}:</span> <span class="json-string">${value}</span>`
        ).join('\n') : 'No request headers';
      
      document.getElementById('requestHeaders').innerHTML = reqHeadersHtml;
      document.getElementById('reqHeaderCount').textContent = Object.keys(reqHeaders).length;
      
      const resHeaders = apiCall.responseHeaders || '';
      const resHeaderCount = resHeaders.split('\n').filter(line => line.includes(':')).length;
      document.getElementById('responseHeaders').innerHTML = resHeaders || 'No response headers';
      document.getElementById('resHeaderCount').textContent = resHeaderCount;
      
      // Request panel
      document.getElementById('requestBody').innerHTML = apiCall.requestBody ? 
        formatJson(apiCall.requestBody) : 'No request body';
      
      // Response panel with size info
      const responseSize = apiCall.response ? new Blob([apiCall.response]).size : 0;
      const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
      };
      
      document.getElementById('responseBody').innerHTML = apiCall.response ? 
        formatJson(apiCall.response) : 'No response body';
      document.getElementById('responseInfo').textContent = formatSize(responseSize);
      
      // Timing panel with performance rating
      const getPerformanceRating = (duration) => {
        if (duration < 100) return '🟢 Excellent';
        if (duration < 300) return '🟡 Good';
        if (duration < 1000) return '🟠 Fair';
        return '🔴 Slow';
      };
      
      document.getElementById('startTime').textContent = new Date(apiCall.timestamp).toLocaleTimeString();
      document.getElementById('duration').textContent = apiCall.duration + 'ms';
      document.getElementById('requestType').textContent = apiCall.type;
      document.getElementById('performance').textContent = getPerformanceRating(apiCall.duration);
      
      // Animate timing phases
      const phases = ['dnsPhase', 'connectPhase', 'requestPhase', 'responsePhase'];
      const phaseDurations = [10, 20, 30, 40]; // Simulated percentages
      
      phases.forEach((phase, index) => {
        setTimeout(() => {
          const bar = document.querySelector(`#${phase} .phase-bar`);
          if (bar) {
            bar.style.setProperty('--width', phaseDurations[index] + '%');
          }
        }, index * 200);
      });
    });
  }
  
  backBtn.addEventListener('click', function() {
    window.location.href = 'popup.html';
  });
  
  loadApiCallDetails();
});

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent || element.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = originalText, 1000);
  });
}