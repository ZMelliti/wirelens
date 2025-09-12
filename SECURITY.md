# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please contact maintainers.

**Please do not report security vulnerabilities through public GitHub issues.**

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue promptly.

## Security Considerations

WireLens operates with minimal permissions:
- `activeTab`: Only accesses the current active tab
- `storage`: Local data storage only
- No external network requests
- No data transmission to external servers

All captured data remains local to your browser.