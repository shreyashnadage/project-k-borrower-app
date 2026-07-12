'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/auth/session';
import { apiClient } from '@/lib/api/client';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { LoanCard } from '@/components/LoanCard';
import type { Locale } from '@/lib/i18n/config';
import type { ActiveLoan } from '@/lib/api/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const params = useParams();
  const locale = params.locale as Locale;
  const router = useRouter();

  const [stats, setStats] = useState<{ activeLoans: number; pendingApplications: number; totalDisbursed: number } | null>(null);
  const [loans, setLoans] = useState<ActiveLoan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthClient();
    auth.getSession().then((session) => {
      if (!session) { router.push(`/${locale}/login`); return; }
      Promise.all([apiClient.getDashboardStats(), apiClient.getActiveLoans()]).then(([s, l]) => {
        setStats(s);
        setLoans(l);
        setLoading(false);
      });
    });
  }, [locale, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 animate-pulse">{t('title')}...</p></div>;

  return (
    <div className="min-h-screen pb-20">
      <Header locale={locale} />
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-lg font-semibold">{t('welcome')}</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats?.activeLoans || 0}</p>
            <p className="text-xs text-slate-500 mt-1">{t('activeLoans')}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats?.pendingApplications || 0}</p>
            <p className="text-xs text-slate-500 mt-1">{t('pendingApplications')}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-green-700">₹{(stats?.totalDisbursed || 0).toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-1">{t('totalDisbursed')}</p>
        </div>

        <Link
          href={`/${locale}/apply`}
          className="block w-full py-3 bg-blue-700 text-white text-center rounded-xl font-medium hover:bg-blue-800 transition-colors"
        >
          {t('quickApply')}
        </Link>

        {loans.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-700">{t('activeLoans')}</h3>
            {loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)}
          </div>
        )}
      </main>
      <BottomNav locale={locale} />
    </div>
  );
}
