/**
 * Converts a transactions array into a CSV string and triggers a browser download.
 * @param {Array} transactions - The array of transaction objects
 * @param {string} [filename='transactions'] - The base filename (without extension)
 */
export function exportToCSV(transactions, filename = 'transactions') {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Date', 'Name', 'Description', 'Category', 'Type', 'Amount (INR)'];

  const rows = transactions.map((tx) => [
    tx.date,
    `"${(tx.name || '').replace(/"/g, '""')}"`,
    `"${(tx.description || '').replace(/"/g, '""')}"`,
    tx.category,
    tx.isPositive ? 'Income' : 'Expense',
    tx.isPositive ? tx.amount.toFixed(2) : `-${tx.amount.toFixed(2)}`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
