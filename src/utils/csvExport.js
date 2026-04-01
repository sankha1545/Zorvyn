/**
 * Convert data to CSV format and download as file
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name for the downloaded file
 * @param {Array} columns - Optional column names/order
 */
export const exportToCSV = (data, fileName = 'export.csv', columns = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Determine columns from first object if not provided
  const cols = columns || Object.keys(data[0]);

  // Create header row
  const header = cols.map(col => `"${col}"`).join(',');

  // Create data rows
  const rows = data.map(obj =>
    cols.map(col => {
      const value = obj[col];
      // Handle null/undefined
      if (value === null || value === undefined) return '""';
      // Quote strings and escape quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return `"${value}"`;
    }).join(',')
  );

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for display in CSV
 */
export const formatDateForCSV = (dateStr) => {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format currency for CSV display
 */
export const formatCurrencyForCSV = (value) => {
  return `$${parseFloat(value).toFixed(2)}`;
};
