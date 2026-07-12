'use client';

import { useTranslations } from 'next-intl';

type GateStatus = 'pending' | 'passed' | 'failed';

interface GateProgressProps {
  gateStatus: {
    d0: GateStatus;
    d1: GateStatus;
    d2: GateStatus;
    d3: GateStatus;
    lender: GateStatus;
  };
}

const gates = ['d0', 'd1', 'd2', 'd3', 'lender'] as const;

function GateIcon({ status }: { status: GateStatus }) {
  if (status === 'passed') return <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>;
  if (status === 'failed') return <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">✕</div>;
  return <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-slate-300" />;
}

export function GateProgress({ gateStatus }: GateProgressProps) {
  const t = useTranslations('gates');

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2">
      {gates.map((gate, idx) => (
        <div key={gate} className="flex items-center">
          <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <GateIcon status={gateStatus[gate]} />
            <span className="text-[10px] text-slate-600 text-center leading-tight">{t(gate)}</span>
          </div>
          {idx < gates.length - 1 && (
            <div className={`w-6 h-0.5 ${gateStatus[gate] === 'passed' ? 'bg-green-500' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
