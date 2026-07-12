'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { getAuthClient } from '@/lib/auth/session';
import { apiClient } from '@/lib/api/client';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { OfferCard } from '@/components/OfferCard';
import type { Locale } from '@/lib/i18n/config';
import type { LoanOffer } from '@/lib/api/mock-data';

export default function OfferDetailPage() {
  const t = useTranslations('offers');
  const tc = useTranslations('common');
  const params = useParams();
  const locale = params.locale as Locale;
  const id = params.id as string;
  const router = useRouter();

  const [offer, setOffer] = useState<LoanOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    const auth = getAuthClient();
    auth.getSession().then((session) => {
      if (!session) { router.push(`/${locale}/login`); return; }
      apiClient.getOffer(id).then((o) => { setOffer(o); setLoading(false); });
    });
  }, [locale, id, router]);

  async function handleRespond(accept: boolean) {
    setResponding(true);
    await apiClient.respondToOffer(id, accept);
    router.push(`/${locale}/applications`);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 animate-pulse">{tc('loading')}</p></div>;
  if (!offer) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{tc('error')}</p></div>;

  return (
    <div className="min-h-screen pb-20">
      <Header locale={locale} />
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <button onClick={() => router.back()} className="text-sm text-blue-700">&larr; {tc('back')}</button>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <OfferCard
          offer={offer}
          onAccept={responding ? undefined : () => handleRespond(true)}
          onReject={responding ? undefined : () => handleRespond(false)}
        />
        {responding && <p className="text-center text-slate-500 animate-pulse">{tc('loading')}</p>}
      </main>
      <BottomNav locale={locale} />
    </div>
  );
}
