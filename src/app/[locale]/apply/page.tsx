'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/auth/session';
import { apiClient } from '@/lib/api/client';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import type { Locale } from '@/lib/i18n/config';
import type { Invoice } from '@/lib/api/mock-data';

export default function ApplyPage() {
  const t = useTranslations('apply');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = params.locale as Locale;
  const router = useRouter();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [tenure, setTenure] = useState('90');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const auth = getAuthClient();
    auth.getSession().then((session) => {
      if (!session) { router.push(`/${locale}/login`); return; }
      apiClient.getInvoices().then((inv) => { setInvoices(inv); setLoading(false); });
    });
  }, [locale, router]);

  const selected = invoices.find((i) => i.id === selectedInvoice);

  async function handleSubmit() {
    if (!selectedInvoice || !amount) return;
    setSubmitting(true);
    try {
      await apiClient.createApplication({ invoiceId: selectedInvoice, amount: parseInt(amount), tenure: parseInt(tenure) });
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/applications`), 1500);
    } catch {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 animate-pulse">{tc('loading')}</p></div>;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-lg font-semibold text-green-700">{t('success')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header locale={locale} />
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-lg font-semibold">{t('title')}</h2>

        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('selectInvoice')}</label>
            <select
              value={selectedInvoice}
              onChange={(e) => { setSelectedInvoice(e.target.value); const inv = invoices.find(i => i.id === e.target.value); if (inv) setAmount(String(Math.round(inv.amount * 0.85))); }}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">--</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.id} — {inv.anchor} — ₹{inv.amount.toLocaleString('en-IN')}</option>
              ))}
            </select>
          </div>

          {selected && (
            <>
              <div className="bg-slate-50 rounded-lg p-3 text-sm">
                <p><span className="text-slate-500">{t('anchor')}:</span> {selected.anchor}</p>
                <p><span className="text-slate-500">{t('invoiceAmount')}:</span> ₹{selected.amount.toLocaleString('en-IN')}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('loanAmount')} (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  max={selected.amount}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('tenure')}</label>
                <select value={tenure} onChange={(e) => setTenure(e.target.value)} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="120">120</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !amount}
                className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors"
              >
                {submitting ? tc('loading') : t('confirmApplication')}
              </button>
            </>
          )}
        </div>
      </main>
      <BottomNav locale={locale} />
    </div>
  );
}
