'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/auth/session';
import { apiClient } from '@/lib/api/client';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { StatusBadge } from '@/components/StatusBadge';
import { GateProgress } from '@/components/GateProgress';
import type { Locale } from '@/lib/i18n/config';
import type { LoanApplication } from '@/lib/api/mock-data';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const t = useTranslations('applications');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = params.locale as Locale;
  const id = params.id as string;
  const router = useRouter();

  const [app, setApp] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthClient();
    auth.getSession().then((session) => {
      if (!session) { router.push(`/${locale}/login`); return; }
      apiClient.getApplication(id).then((a) => { setApp(a); setLoading(false); });
    });
  }, [locale, id, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 animate-pulse">{tc('loading')}</p></div>;
  if (!app) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{tc('error')}</p></div>;

  return (
    <div className="min-h-screen pb-20">
      <Header locale={locale} />
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <button onClick={() => router.back()} className="text-sm text-blue-700">&larr; {tc('back')}</button>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500">{app.id}</p>
              <p className="text-xl font-bold">₹{app.requestedAmount.toLocaleString('en-IN')}</p>
              <p className="text-sm text-slate-600">{app.anchor}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-sm font-medium mb-2">{t('gateProgress')}</p>
            <GateProgress gateStatus={app.gateStatus} />
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Invoice:</span> {app.invoiceId}</div>
            <div><span className="text-slate-500">Tenure:</span> {app.tenure} days</div>
            <div><span className="text-slate-500">Invoice Amt:</span> ₹{app.amount.toLocaleString('en-IN')}</div>
            <div><span className="text-slate-500">Applied:</span> {app.createdAt}</div>
          </div>

          {app.offerId && (
            <Link href={`/${locale}/offers/${app.offerId}`} className="block mt-4 py-2.5 bg-green-700 text-white text-center rounded-lg font-medium hover:bg-green-800 transition-colors">
              View Offer
            </Link>
          )}
        </div>
      </main>
      <BottomNav locale={locale} />
    </div>
  );
}
