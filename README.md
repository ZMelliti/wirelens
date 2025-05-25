# WireLens

A lightweight browser extension that logs and visualizes all API calls made by any website in real time.  
Ideal for developers and QA engineers to debug, monitor, and analyze network requests effortlessly.

---

## Features

- Logs all API calls (XHR, Fetch, WebSocket) made by the webpage in real time.
- Visualizes request/response details including URL, method, status, headers, and payload.
- Filters requests by method, status, or domain.
- Simple and intuitive UI embedded in the extension popup.
- Lightweight and performant, designed to have minimal impact on browsing experience.
- Open source and easy to extend.

---

## Screenshots

*(Add screenshots here of the UI showing logged API calls)*

---

## Installation

### From Chrome Web Store / Firefox Add-ons (if published)

1. Search for **WireLens** in your browser's extension store.
2. Click **Add to Chrome/Firefox**.
3. Click the extension icon to start monitoring API calls on any webpage.

### Manual Installation (For Developers)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/wirelens.git
   cd wirelens
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the WireLens directory
5. The WireLens icon should appear in your extensions toolbar

---

## Usage

1. **Start Monitoring**: Click the WireLens extension icon while on any webpage
2. **View API Calls**: All network requests will appear in real-time in the popup
3. **Filter Requests**: Use the dropdown filters to show specific methods or status codes
4. **Inspect Details**: Click on any API call to view detailed request/response information
5. **Export Data**: Click the "Export" button to download API calls as JSON
6. **Clear History**: Click "Clear" to remove all logged requests

---

## Features in Detail

### Supported Request Types
- **XMLHttpRequest (XHR)**: Traditional AJAX requests
- **Fetch API**: Modern promise-based HTTP requests  
- **WebSocket**: Real-time bidirectional communication

### Filtering Options
- Filter by HTTP method (GET, POST, PUT, DELETE, PATCH)
- Filter by response status (2xx, 3xx, 4xx, 5xx)
- Real-time updates as new requests are made

### Data Export
- Export all captured requests as JSON format
- Includes full request/response details
- Timestamped for analysis

---

## Development

### Project Structure
```
wirelens/
├── manifest.json          # Extension configuration
├── content.js            # API interception logic
├── background.js         # Extension lifecycle management
├── popup.html           # Main UI interface
├── popup.js             # UI logic and filtering
├── details.html         # Detailed view interface
├── details.js           # Detail view logic
├── export.js            # Data export functionality
└── icons/               # Extension icons
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Changelog

### v1.0.0
- Initial release with XHR, Fetch, and WebSocket monitoring
- Real-time API call visualization
- Request/response filtering
- Detailed inspection view
- JSON export functionality
