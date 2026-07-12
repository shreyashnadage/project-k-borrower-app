'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { Locale } from '@/lib/i18n/config';
import { apiClient } from '@/lib/api/client';

export default function InvitePage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;
  const token = params.token as string;

  const [name, setName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [udyam, setUdyam] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleActivate() {
    setLoading(true);
    setError('');
    try {
      await apiClient.activateInvite({
        invite_token: token,
        name,
        gstin,
        phone,
        udyam_number: udyam || undefined,
      });
      setSuccess(true);
      setTimeout(() => router.push(`/${locale}/login`), 2000);
    } catch (e: any) {
      setError(e.message || 'Activation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
            <div className="text-4xl mb-4">&#10003;</div>
            <h2 className="text-xl font-semibold mb-2 text-green-700">
              Account Activated
            </h2>
            <p className="text-slate-600 text-sm">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">{tc('appName')}</h1>
          <LanguageSwitcher currentLocale={locale} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-2">Complete Registration</h2>
          <p className="text-sm text-slate-500 mb-6">
            You&apos;ve been invited to join the platform. Fill in your details below.
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your company name"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                placeholder="27AADCB2230M1ZT"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
                maxLength={15}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phoneHint')}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Udyam Number <span className="text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={udyam}
                onChange={(e) => setUdyam(e.target.value.toUpperCase())}
                placeholder="UDYAM-MH-00-0000000"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono"
              />
            </div>

            <button
              onClick={handleActivate}
              disabled={loading || !name || !gstin || phone.length !== 10}
              className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? tc('loading') : 'Activate Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
