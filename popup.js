// WireLens Popup Script
document.addEventListener('DOMContentLoaded', function() {
  const apiList = document.getElementById('apiList');
  const methodFilter = document.getElementById('methodFilter');
  const statusFilter = document.getElementById('statusFilter');
  const domainFilter = document.getElementById('domainFilter');
  const typeFilter = document.getElementById('typeFilter');
  const timeFilter = document.getElementById('timeFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const searchInput = document.getElementById('searchInput');
  const pauseBtn = document.getElementById('pauseBtn');
  const autoRefreshBtn = document.getElementById('autoRefreshBtn');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  
  let autoRefresh = true;
  let refreshInterval;
  const listView = document.getElementById('listView');
  const chartView = document.getElementById('chartView');
  
  let isPaused = false;
  let currentView = 'list';
  
  // Tab functionality
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      
      // Update active tab
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active panel
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(tabName + '-panel').classList.add('active');
    });
  });
  
  // Update stats
  function updateStats() {
    const total = allApiCalls.length;
    const errors = allApiCalls.filter(call => call.status >= 400 || call.status === 0).length;
    const avgDuration = total > 0 ? Math.round(allApiCalls.reduce((sum, call) => sum + (call.duration || 0), 0) / total) : 0;
    const errorRate = total > 0 ? Math.round((errors / total) * 100) : 0;
    
    document.getElementById('totalCount').textContent = total + ' requests';
    document.getElementById('totalRequests').textContent = total;
    document.getElementById('avgDuration').textContent = avgDuration + 'ms';
    document.getElementById('errorRate').textContent = errorRate + '%';
    document.getElementById('activeStatus').style.color = isPaused ? '#FF9800' : '#4CAF50';
  }
  
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
  
  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
  function getRequestSize(call) {
    let size = 0;
    if (call.requestBody) {
      size += new Blob([call.requestBody]).size;
    }
    if (call.response) {
      size += new Blob([call.response]).size;
    }
    return size;
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
        <span class="size">${formatBytes(getRequestSize(call))}</span>
        <div class="api-details">
          <div class="headers">${Object.keys(call.requestHeaders || {}).length} headers</div>
          <div class="timestamp">${new Date(call.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
    `).join('');
    
    apiList.innerHTML = html;
    
    // Add click listeners to API items
    document.querySelectorAll('.api-item').forEach(item => {
      item.addEventListener('click', handleApiItemClick);
    });
  }
  
  function getDomain(url) {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }
  
  function updateDomainFilter() {
    const domains = [...new Set(allApiCalls.map(call => getDomain(call.url)))];
    const currentValue = domainFilter.value;
    
    domainFilter.innerHTML = '<option value="">All Domains</option>';
    domains.forEach(domain => {
      const option = document.createElement('option');
      option.value = domain;
      option.textContent = domain;
      domainFilter.appendChild(option);
    });
    
    domainFilter.value = currentValue;
  }
  
  function filterApiCalls() {
    const methodValue = methodFilter.value;
    const statusValue = statusFilter.value;
    const domainValue = domainFilter.value;
    const typeValue = typeFilter.value;
    const timeValue = timeFilter.value;
    const sizeValue = sizeFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    
    let filtered = allApiCalls;
    
    if (methodValue) {
      filtered = filtered.filter(call => call.method === methodValue);
    }
    
    if (statusValue) {
      const statusPrefix = parseInt(statusValue);
      filtered = filtered.filter(call => {
        const status = parseInt(call.status);
        return statusValue === '0' ? status === 0 : Math.floor(status / 100) === statusPrefix;
      });
    }
    
    if (domainValue) {
      filtered = filtered.filter(call => getDomain(call.url) === domainValue);
    }
    
    if (typeValue) {
      filtered = filtered.filter(call => call.type === typeValue);
    }
    
    if (timeValue) {
      const now = Date.now();
      const timeMap = { '1m': 60000, '5m': 300000, '15m': 900000, '1h': 3600000 };
      const timeLimit = timeMap[timeValue];
      filtered = filtered.filter(call => {
        const callTime = new Date(call.timestamp).getTime();
        return (now - callTime) <= timeLimit;
      });
    }
    
    if (sizeValue) {
      filtered = filtered.filter(call => {
        const size = getRequestSize(call);
        if (sizeValue === 'small') return size < 1024;
        if (sizeValue === 'medium') return size >= 1024 && size <= 102400;
        if (sizeValue === 'large') return size > 102400;
        return true;
      });
    }
    
    if (searchValue) {
      filtered = filtered.filter(call => 
        call.url.toLowerCase().includes(searchValue) ||
        call.method.toLowerCase().includes(searchValue)
      );
    }
    
    renderApiCalls(filtered);
  }
  
  function handleApiItemClick(event) {
    const apiItem = event.target.closest('.api-item');
    if (apiItem) {
      const callId = apiItem.dataset.id;
      window.location.href = `details.html?id=${callId}`;
    }
  }
  
  function loadApiCalls() {
    if (isPaused) return;
    
    chrome.storage.local.get(['apiCalls'], function(result) {
      console.log('WireLens Popup: Storage result', result);
      allApiCalls = result.apiCalls || [];
      console.log('WireLens Popup: API calls count', allApiCalls.length);
      updateDomainFilter();
      updateStats();
      filterApiCalls();
    });
  }
  
  // Event listeners
  methodFilter.addEventListener('change', filterApiCalls);
  statusFilter.addEventListener('change', filterApiCalls);
  domainFilter.addEventListener('change', filterApiCalls);
  typeFilter.addEventListener('change', filterApiCalls);
  timeFilter.addEventListener('change', filterApiCalls);
  sizeFilter.addEventListener('change', filterApiCalls);
  searchInput.addEventListener('input', filterApiCalls);
  
  pauseBtn.addEventListener('click', function() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
    updateStats();
  });
  
  autoRefreshBtn.addEventListener('click', function() {
    autoRefresh = !autoRefresh;
    autoRefreshBtn.style.opacity = autoRefresh ? '1' : '0.5';
    if (autoRefresh) {
      refreshInterval = setInterval(loadApiCalls, 500);
    } else {
      clearInterval(refreshInterval);
    }
  });
  
  clearBtn.addEventListener('click', function() {
    chrome.storage.local.set({ apiCalls: [] });
    allApiCalls = [];
    renderApiCalls([]);
  });
  
  exportBtn.addEventListener('click', function() {
    if (allApiCalls.length > 0) {
      exportApiCalls(allApiCalls, 'json');
    }
  });
  
  // Load initial data
  loadApiCalls();
  
  // Start auto-refresh interval
  refreshInterval = setInterval(loadApiCalls, 500);
});