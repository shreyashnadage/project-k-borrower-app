import { useTranslations } from 'next-intl';

type Status = 'pending' | 'processing' | 'approved' | 'rejected' | 'disbursed' | 'completed' | 'expired';

const statusColors: Record<Status, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  disbursed: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-slate-100 text-slate-800',
  expired: 'bg-gray-100 text-gray-600',
};

export function StatusBadge({ status }: { status: Status }) {
  const t = useTranslations('status');
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {t(status)}
    </span>
  );
}
