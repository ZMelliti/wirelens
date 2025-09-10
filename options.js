// WireLens Options Script
document.addEventListener('DOMContentLoaded', function() {
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
  
  // Default settings
  const defaultSettings = {
    maxCalls: 1000,
    autoClear: true,
    exportFormat: 'json',
    monitorWebSockets: true,
    monitorXHR: true,
    monitorFetch: true,
    refreshInterval: 500,
    includeResponses: true
  };
  
  // Toggle functionality
  function setupToggle(toggleId, settingKey) {
    const toggle = document.getElementById(toggleId);
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
    return toggle;
  }
  
  const toggles = {
    autoClear: setupToggle('autoClearToggle', 'autoClear'),
    monitorWebSockets: setupToggle('monitorWebSocketsToggle', 'monitorWebSockets'),
    monitorXHR: setupToggle('monitorXHRToggle', 'monitorXHR'),
    monitorFetch: setupToggle('monitorFetchToggle', 'monitorFetch'),
    includeResponses: setupToggle('includeResponsesToggle', 'includeResponses')
  };
  
  // Performance indicator
  const maxCallsInput = document.getElementById('maxCalls');
  const performanceIndicator = document.getElementById('performanceIndicator');
  const performanceText = document.getElementById('performanceText');
  
  function updatePerformanceIndicator(value) {
    const classes = ['performance-good', 'performance-medium', 'performance-high'];
    performanceIndicator.className = 'performance-indicator ';
    
    if (value <= 1000) {
      performanceIndicator.classList.add('performance-good');
      performanceText.textContent = 'Good performance';
    } else if (value <= 3000) {
      performanceIndicator.classList.add('performance-medium');
      performanceText.textContent = 'Medium performance';
    } else {
      performanceIndicator.classList.add('performance-high');
      performanceText.textContent = 'May impact performance';
    }
  }
  
  maxCallsInput.addEventListener('input', (e) => {
    updatePerformanceIndicator(parseInt(e.target.value));
  });
  
  // Load settings
  function loadSettings() {
    chrome.storage.sync.get(defaultSettings, function(settings) {
      maxCallsInput.value = settings.maxCalls;
      document.getElementById('refreshInterval').value = settings.refreshInterval;
      document.getElementById('exportFormat').value = settings.exportFormat;
      
      // Update toggles
      toggles.autoClear.classList.toggle('active', settings.autoClear);
      toggles.monitorWebSockets.classList.toggle('active', settings.monitorWebSockets);
      toggles.monitorXHR.classList.toggle('active', settings.monitorXHR);
      toggles.monitorFetch.classList.toggle('active', settings.monitorFetch);
      toggles.includeResponses.classList.toggle('active', settings.includeResponses);
      
      updatePerformanceIndicator(settings.maxCalls);
    });
  }
  
  // Save settings
  function saveSettings() {
    const maxCalls = parseInt(maxCallsInput.value);
    const refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    
    // Validate settings
    if (maxCalls < 100 || maxCalls > 5000) {
      showStatus('Max calls must be between 100 and 5000', 'error');
      return;
    }
    
    const settings = {
      maxCalls,
      refreshInterval,
      exportFormat: document.getElementById('exportFormat').value,
      autoClear: toggles.autoClear.classList.contains('active'),
      monitorWebSockets: toggles.monitorWebSockets.classList.contains('active'),
      monitorXHR: toggles.monitorXHR.classList.contains('active'),
      monitorFetch: toggles.monitorFetch.classList.contains('active'),
      includeResponses: toggles.includeResponses.classList.contains('active')
    };
    
    chrome.storage.sync.set(settings, function() {
      // Notify all tabs of settings change
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          if (tab.url && !tab.url.startsWith('chrome://')) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'SETTINGS_UPDATED',
              settings: settings
            }).catch(() => {});
          }
        });
      });
      
      // Clear excess API calls if max was reduced
      chrome.storage.local.get(['apiCalls'], function(result) {
        const apiCalls = result.apiCalls || [];
        if (apiCalls.length > maxCalls) {
          const trimmed = apiCalls.slice(-maxCalls);
          chrome.storage.local.set({ apiCalls: trimmed });
        }
      });
      
      showStatus('Settings saved and applied successfully!', 'success');
    });
  }
  
  // Reset settings
  function resetSettings() {
    chrome.storage.sync.set(defaultSettings, function() {
      loadSettings();
      showStatus('Settings reset to defaults!', 'success');
    });
  }
  
  // Show status message
  function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type} show`;
    
    setTimeout(() => {
      status.classList.remove('show');
    }, 3000);
  }
  
  // Event listeners
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  
  // Load settings on page load
  loadSettings();
});