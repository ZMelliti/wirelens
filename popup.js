// WireLens Popup Script
document.addEventListener('DOMContentLoaded', function() {
  const apiList = document.getElementById('apiList');
  const methodFilter = document.getElementById('methodFilter');
  const statusFilter = document.getElementById('statusFilter');
  const clearBtn = document.getElementById('clearBtn');
  
  let allApiCalls = [];
  
  function formatUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }
  
  function getStatusClass(status) {
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    if (status >= 500) return 'status-5xx';
    return '';
  }
  
  function renderApiCalls(apiCalls) {
    if (!apiCalls || apiCalls.length === 0) {
      apiList.innerHTML = '<div class="empty-state">No API calls detected. Navigate to a website to start monitoring.</div>';
      return;
    }
    
    const html = apiCalls.map(call => `
      <div class="api-item" data-id="${call.id}">
        <span class="method ${call.method}">${call.method}</span>
        <span class="status ${getStatusClass(call.status)}">${call.status}</span>
        <span class="url" title="${call.url}">${formatUrl(call.url)}</span>
        <span class="duration">${call.duration}ms</span>
      </div>
    `).join('');
    
    apiList.innerHTML = html;
  }
  
  function filterApiCalls() {
    const methodValue = methodFilter.value;
    const statusValue = statusFilter.value;
    
    let filtered = allApiCalls;
    
    if (methodValue) {
      filtered = filtered.filter(call => call.method === methodValue);
    }
    
    if (statusValue) {
      const statusPrefix = parseInt(statusValue);
      filtered = filtered.filter(call => {
        const status = parseInt(call.status);
        return Math.floor(status / 100) === statusPrefix;
      });
    }
    
    renderApiCalls(filtered);
  }
  
  function loadApiCalls() {
    chrome.storage.local.get(['apiCalls'], function(result) {
      allApiCalls = result.apiCalls || [];
      filterApiCalls();
    });
  }
  
  // Event listeners
  methodFilter.addEventListener('change', filterApiCalls);
  statusFilter.addEventListener('change', filterApiCalls);
  
  clearBtn.addEventListener('click', function() {
    chrome.storage.local.set({ apiCalls: [] });
    allApiCalls = [];
    renderApiCalls([]);
  });
  
  // Load initial data
  loadApiCalls();
  
  // Refresh every second
  setInterval(loadApiCalls, 1000);
});