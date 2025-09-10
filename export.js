// WireLens Export Functionality
function exportApiCalls(apiCalls, format = 'json', includeResponses = true) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  if (format === 'json') {
    const data = prepareJsonExport(apiCalls, includeResponses);
    downloadFile(JSON.stringify(data, null, 2), `wirelens-export-${timestamp}.json`, 'application/json');
  } else if (format === 'csv') {
    const csv = convertToCSV(apiCalls);
    downloadFile(csv, `wirelens-export-${timestamp}.csv`, 'text/csv');
  } else if (format === 'har') {
    const har = convertToHAR(apiCalls, includeResponses);
    downloadFile(JSON.stringify(har, null, 2), `wirelens-export-${timestamp}.har`, 'application/json');
  }
}

function prepareJsonExport(apiCalls, includeResponses) {
  return {
    version: '1.0',
    generator: 'WireLens',
    exportDate: new Date().toISOString(),
    totalRequests: apiCalls.length,
    requests: apiCalls.map(call => {
      const exportCall = {
        id: call.id,
        timestamp: call.timestamp,
        method: call.method,
        url: call.url,
        status: call.status,
        statusText: call.statusText,
        duration: call.duration,
        type: call.type,
        requestHeaders: call.requestHeaders
      };
      
      if (includeResponses) {
        exportCall.requestBody = call.requestBody;
        exportCall.response = call.response;
        exportCall.responseHeaders = call.responseHeaders;
      }
      
      return exportCall;
    })
  };
}

function convertToCSV(apiCalls) {
  if (!apiCalls.length) return '';
  
  const headers = ['Timestamp', 'Method', 'URL', 'Status', 'Duration (ms)', 'Type', 'Size (bytes)'];
  const rows = apiCalls.map(call => [
    call.timestamp,
    call.method,
    call.url,
    call.status,
    call.duration,
    call.type,
    getRequestSize(call)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field || ''}"`).join(','))
    .join('\n');
    
  return csvContent;
}

function convertToHAR(apiCalls, includeResponses) {
  const har = {
    log: {
      version: '1.2',
      creator: {
        name: 'WireLens',
        version: '1.0'
      },
      entries: apiCalls.map(call => {
        const entry = {
          startedDateTime: call.timestamp,
          time: call.duration || 0,
          request: {
            method: call.method,
            url: call.url,
            httpVersion: 'HTTP/1.1',
            headers: formatHeadersForHAR(call.requestHeaders),
            queryString: [],
            cookies: [],
            headersSize: -1,
            bodySize: call.requestBody ? new Blob([call.requestBody]).size : 0
          },
          response: {
            status: call.status || 0,
            statusText: call.statusText || '',
            httpVersion: 'HTTP/1.1',
            headers: formatHeadersForHAR(call.responseHeaders),
            cookies: [],
            content: {
              size: 0,
              mimeType: 'application/json'
            },
            redirectURL: '',
            headersSize: -1,
            bodySize: 0
          },
          cache: {},
          timings: {
            blocked: -1,
            dns: -1,
            connect: -1,
            send: 0,
            wait: call.duration || 0,
            receive: 0,
            ssl: -1
          }
        };
        
        if (includeResponses && call.requestBody) {
          entry.request.postData = {
            mimeType: 'application/json',
            text: call.requestBody
          };
        }
        
        if (includeResponses && call.response) {
          entry.response.content.text = call.response;
          entry.response.content.size = new Blob([call.response]).size;
          entry.response.bodySize = entry.response.content.size;
        }
        
        return entry;
      })
    }
  };
  
  return har;
}

function formatHeadersForHAR(headers) {
  if (!headers) return [];
  
  if (typeof headers === 'string') {
    return headers.split('\n')
      .filter(line => line.includes(':'))
      .map(line => {
        const [name, ...valueParts] = line.split(':');
        return {
          name: name.trim(),
          value: valueParts.join(':').trim()
        };
      });
  }
  
  if (typeof headers === 'object') {
    return Object.entries(headers).map(([name, value]) => ({
      name,
      value: String(value)
    }));
  }
  
  return [];
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

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}