import type { ActiveLoan } from '@/lib/api/mock-data';

export function LoanCard({ loan }: { loan: ActiveLoan }) {
  const progress = ((loan.amount - loan.outstanding) / loan.amount) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-slate-500">{loan.lender}</p>
          <p className="text-lg font-semibold text-slate-900">₹{loan.amount.toLocaleString('en-IN')}</p>
        </div>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{loan.status}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate-500">
        <span>EMI: ₹{loan.emi.toLocaleString('en-IN')}</span>
        <span>Due: {loan.nextDueDate}</span>
      </div>
    </div>
  );
}
