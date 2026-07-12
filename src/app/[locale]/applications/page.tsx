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

export default function ApplicationsPage() {
  const t = useTranslations('applications');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = params.locale as Locale;
  const router = useRouter();

  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthClient();
    auth.getSession().then((session) => {
      if (!session) { router.push(`/${locale}/login`); return; }
      apiClient.getApplications().then((apps) => { setApplications(apps); setLoading(false); });
    });
  }, [locale, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 animate-pulse">{tc('loading')}</p></div>;

  return (
    <div className="min-h-screen pb-20">
      <Header locale={locale} />
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-lg font-semibold">{t('title')}</h2>

        {applications.length === 0 ? (
          <p className="text-slate-500 text-center py-8">{t('noApplications')}</p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link key={app.id} href={`/${locale}/applications/${app.id}`} className="block bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">{app.anchor}</p>
                    <p className="text-lg font-semibold">₹{app.requestedAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <GateProgress gateStatus={app.gateStatus} />
                <p className="text-xs text-slate-400 mt-2">{app.createdAt}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <BottomNav locale={locale} />
    </div>
  );
}
