# WireLens API Documentation

## Extension Architecture

### Content Script (`content.js`)
Injects monitoring script into web pages and handles message passing.

### Injected Script (`inject.js`)
Intercepts browser APIs in page context:
- `XMLHttpRequest`
- `fetch()`
- `WebSocket` (planned)

### Background Script (`background.js`)
Manages extension lifecycle and cross-tab communication.

## Data Structure

### API Call Object
```javascript
{
  id: number,           // Unique identifier
  timestamp: string,    // ISO timestamp
  method: string,       // HTTP method
  url: string,          // Request URL
  status: number,       // Response status
  statusText: string,   // Status description
  duration: number,     // Request duration (ms)
  type: string,         // 'XHR' | 'Fetch' | 'WebSocket'
  requestHeaders: object,
  requestBody: string,
  responseHeaders: string,
  response: string
}
```

## Storage

### Chrome Storage Local
- `apiCalls`: Array of API call objects
- Automatically managed with configurable limits

### Chrome Storage Sync
- User settings and preferences
- Synced across Chrome instances

## Settings Schema

```javascript
{
  maxCalls: number,           // Max stored calls (100-5000)
  refreshInterval: number,    // Update interval (ms)
  exportFormat: string,       // 'json' | 'csv' | 'har'
  monitorWebSockets: boolean,
  monitorXHR: boolean,
  monitorFetch: boolean,
  includeResponses: boolean,
  autoClear: boolean
}
```

## Export Formats

### JSON
Standard WireLens format with metadata

### CSV
Tabular format for spreadsheet analysis

### HAR
HTTP Archive format for developer tools