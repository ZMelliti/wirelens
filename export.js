// WireLens Export Functionality
function exportApiCalls(apiCalls, format = 'json') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  if (format === 'json') {
    const data = JSON.stringify(apiCalls, null, 2);
    downloadFile(data, `wirelens-export-${timestamp}.json`, 'application/json');
  } else if (format === 'csv') {
    const csv = convertToCSV(apiCalls);
    downloadFile(csv, `wirelens-export-${timestamp}.csv`, 'text/csv');
  }
}

function convertToCSV(apiCalls) {
  if (!apiCalls.length) return '';
  
  const headers = ['Timestamp', 'Method', 'URL', 'Status', 'Duration (ms)', 'Type'];
  const rows = apiCalls.map(call => [
    call.timestamp,
    call.method,
    call.url,
    call.status,
    call.duration,
    call.type
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
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