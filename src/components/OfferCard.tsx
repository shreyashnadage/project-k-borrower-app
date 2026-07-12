import type { LoanOffer } from '@/lib/api/mock-data';

export function OfferCard({ offer, onAccept, onReject }: { offer: LoanOffer; onAccept?: () => void; onReject?: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-slate-500">{offer.lender}</p>
          <p className="text-2xl font-bold text-slate-900">₹{offer.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500">Rate</p>
          <p className="font-semibold text-sm">{offer.rate}%</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500">Tenure</p>
          <p className="font-semibold text-sm">{offer.tenure}d</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2">
          <p className="text-xs text-slate-500">EMI</p>
          <p className="font-semibold text-sm">₹{offer.emi.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-4">Expires: {offer.expiresAt}</p>
      {offer.status === 'pending' && onAccept && onReject && (
        <div className="flex gap-3">
          <button onClick={onReject} className="flex-1 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50">
            Reject
          </button>
          <button onClick={onAccept} className="flex-1 py-2 bg-blue-700 rounded-lg text-sm text-white hover:bg-blue-800">
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
