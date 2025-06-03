// WireLens Options Script
document.addEventListener('DOMContentLoaded', function() {
  const maxCallsInput = document.getElementById('maxCalls');
  const autoClearCheckbox = document.getElementById('autoClear');
  const exportFormatSelect = document.getElementById('exportFormat');
  const monitorWebSocketsCheckbox = document.getElementById('monitorWebSockets');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  
  // Default settings
  const defaultSettings = {
    maxCalls: 1000,
    autoClear: true,
    exportFormat: 'json',
    monitorWebSockets: true
  };
  
  // Load saved settings
  function loadSettings() {
    chrome.storage.sync.get(defaultSettings, function(settings) {
      maxCallsInput.value = settings.maxCalls;
      autoClearCheckbox.checked = settings.autoClear;
      exportFormatSelect.value = settings.exportFormat;
      monitorWebSocketsCheckbox.checked = settings.monitorWebSockets;
    });
  }
  
  // Save settings
  function saveSettings() {
    const settings = {
      maxCalls: parseInt(maxCallsInput.value),
      autoClear: autoClearCheckbox.checked,
      exportFormat: exportFormatSelect.value,
      monitorWebSockets: monitorWebSocketsCheckbox.checked
    };
    
    chrome.storage.sync.set(settings, function() {
      // Show success message
      status.style.display = 'block';
      status.className = 'status success';
      
      // Hide message after 3 seconds
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    });
  }
  
  // Event listeners
  saveBtn.addEventListener('click', saveSettings);
  
  // Load settings on page load
  loadSettings();
});