# 🔍 WireLens

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()

A modern, lightweight browser extension that captures and visualizes all API calls made by websites in real-time. Perfect for developers, QA engineers, and security researchers.

## ✨ Key Features

### 🚀 Real-time Monitoring
- **XHR & Fetch API**: Captures all AJAX and modern fetch requests
- **WebSocket Support**: Monitors real-time bidirectional communication
- **Live Updates**: See requests as they happen with auto-refresh

### 🎨 Modern Interface
- **Glassmorphism Design**: Beautiful, modern UI with backdrop blur effects
- **Tabbed Layout**: Organized interface for better data management
- **Dark/Light Themes**: Adaptive design for any preference

### 🔧 Advanced Filtering
- **Method Filter**: GET, POST, PUT, DELETE, PATCH
- **Status Codes**: 2xx, 3xx, 4xx, 5xx responses
- **Domain Filter**: Focus on specific hosts
- **Time Range**: Last 1m, 5m, 15m, 1h
- **Size Filter**: Small, medium, large requests
- **Search**: Find specific URLs or methods

### 📊 Detailed Analysis
- **Request/Response Headers**: Full header inspection
- **Timing Visualization**: Performance breakdown
- **Payload Inspection**: JSON formatting and syntax highlighting
- **Performance Metrics**: Duration, size, and efficiency ratings

---

## Screenshots

*(Add screenshots here of the UI showing logged API calls)*

---

## Installation

### Manual Installation (For Developers)

1. Clone this repository:
   ```bash
   git clone https://github.com/zmelliti/wirelens.git
   cd wirelens
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the WireLens directory
5. The WireLens icon should appear in your extensions toolbar

---

## 🚀 Quick Start

1. **Install**: Load the extension in Chrome developer mode
2. **Navigate**: Go to any website you want to monitor
3. **Open**: Click the WireLens icon in your toolbar
4. **Monitor**: Watch API calls appear in real-time
5. **Analyze**: Click any request for detailed inspection
6. **Export**: Save data in your preferred format

## 📚 Advanced Usage

### Filtering Requests
- Use **multiple filters** simultaneously for precise results
- **Search bar** supports URL and method matching
- **Time filters** help focus on recent activity
- **Size filters** identify large payloads

### Performance Analysis
- **Timing charts** show request breakdown
- **Performance ratings** indicate response speed
- **Size metrics** help identify optimization opportunities
- **Error tracking** highlights failed requests

### Data Export
- **JSON**: Full data preservation with metadata
- **CSV**: Import into Excel, Google Sheets, or databases
- **HAR**: Compatible with Chrome DevTools and other analyzers

---

## 🛠️ Development

### Architecture
- **Manifest V3**: Modern Chrome extension standards
- **Content Scripts**: Secure API interception
- **Storage API**: Efficient data management
- **Modern JavaScript**: ES6+ features throughout

### File Structure
```
wirelens/
├── manifest.json          # Extension configuration
├── content.js            # Page script injection
├── inject.js             # API interception logic
├── popup.html/js         # Main interface
├── details.html/js       # Request details view
├── options.html/js       # Settings page
├── export.js             # Data export functionality
└── icons/                # Extension icons
```

### Local Development
1. Clone the repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the project folder
5. Make changes and reload the extension

### 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

#### Ways to Contribute
- 🐛 **Bug Reports**: Found an issue? Let us know!
- ✨ **Feature Requests**: Have an idea? We'd love to hear it!
- 📝 **Documentation**: Help improve our docs
- 💻 **Code**: Submit pull requests for fixes and features

#### Development Setup
```bash
git clone https://github.com/zmelliti/wirelens.git
cd wirelens
# Load in Chrome as unpacked extension
```

---

## License

MIT License - see LICENSE file for details

---

## 📋 Documentation

- [API Documentation](API.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Security Policy](SECURITY.md)

---

**Made with ❤️ by for the community by [Zied MELLITI](https://github.com/zmelliti)**