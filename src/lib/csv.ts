import { type Transaction } from './queries';

function formatDate(date: Date) {
  const month = date.getMonth() + 1; // Months are 0-indexed
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export function toCSVString(data: Transaction[]) {
  const header = 'Date,Payee,Amount,Tags\n';
  const rows = data
    .map((transaction) => {
      return `${formatDate(transaction.date)},"${transaction.payee.replaceAll(
        '"',
        `\"`,
      )}",${transaction.amount},`;
    })
    .join('\n');
  return header + rows + '\n';
}
