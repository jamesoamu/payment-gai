export function formatCurrency(
  amount: number,
  symbol: string = '₦',
  decimals: boolean = false
): string {
  if (isNaN(amount)) return `${symbol}0`;
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
  return `${amount < 0 ? '-' : ''}${symbol}${formatted}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} · ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return dateStr;
  }
}

export function getStatusText(status: 'paid' | 'partial' | 'overdue' | 'unpaid'): string {
  switch (status) {
    case 'paid':
      return 'Fully Paid';
    case 'partial':
      return 'Partial Balance';
    case 'overdue':
      return 'Overdue';
    case 'unpaid':
      return 'Pending Payment';
    default:
      return status;
  }
}

export function getStatusColor(status: 'paid' | 'partial' | 'overdue' | 'unpaid'): {
  text: string;
  dot: string;
  bgLight: string;
} {
  switch (status) {
    case 'paid':
      return {
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
        bgLight: 'bg-emerald-50 border-emerald-200',
      };
    case 'partial':
      return {
        text: 'text-amber-700',
        dot: 'bg-amber-500',
        bgLight: 'bg-amber-50 border-amber-200',
      };
    case 'overdue':
      return {
        text: 'text-rose-700',
        dot: 'bg-rose-500',
        bgLight: 'bg-rose-50 border-rose-200',
      };
    case 'unpaid':
      return {
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        bgLight: 'bg-slate-100 border-slate-200',
      };
    default:
      return {
        text: 'text-slate-600',
        dot: 'bg-slate-400',
        bgLight: 'bg-slate-100 border-slate-200',
      };
  }
}
