// WireLens Background Script
chrome.runtime.onInstalled.addListener(() => {
  console.log('WireLens extension installed');
});

// Clear storage when extension starts
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.clear();
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setTabId' && sender.tab) {
    chrome.storage.local.set({ currentTabId: sender.tab.id });
  }
});

// Handle tab updates to clear data for new pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    chrome.storage.local.get(['currentTabId'], (result) => {
      if (result.currentTabId === tabId) {
        chrome.storage.local.set({ apiCalls: [] });
      }
    });
  }
});