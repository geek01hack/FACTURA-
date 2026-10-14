import { InvoiceItem } from '../types';

export function formatFCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA';
  return `${Math.round(amount).toLocaleString('fr-FR')} FCFA`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getDaysDifference(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotals(
  items: InvoiceItem[],
  taxRate: number = 0,
  aibRate: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const aibAmount = (subtotal * aibRate) / 100;
  const totalAmount = subtotal + taxAmount + aibAmount;

  return {
    subtotal,
    taxAmount,
    aibAmount,
    totalAmount,
  };
}

export function getInvoiceStatusBadge(status: string, dueDate: string) {
  if (status === 'paid') {
    return {
      label: 'Payée',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  const daysLeft = getDaysDifference(dueDate);
  if (daysLeft < 0) {
    const overdueDays = Math.abs(daysLeft);
    return {
      label: `Retard (${overdueDays}j)`,
      color: 'text-rose-700 bg-rose-50 border-rose-200',
    };
  }

  if (daysLeft === 0) {
    return {
      label: "Échéance aujourd'hui",
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }

  return {
    label: `Échéance dans ${daysLeft}j`,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  };
}
