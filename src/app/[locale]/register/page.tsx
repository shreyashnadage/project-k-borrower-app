'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { getAuthClient } from '@/lib/auth/session';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import type { Locale } from '@/lib/i18n/config';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as Locale;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const auth = getAuthClient();

  async function handleSendOtp() {
    setLoading(true);
    setError('');
    try {
      await auth.sendOtp(phone);
      setOtpSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setLoading(true);
    setError('');
    try {
      await auth.register(phone, otp, name);
      router.push(`/${locale}/dashboard`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-sm">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-800">{tc('appName')}</h1>
          <LanguageSwitcher currentLocale={locale} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6">{t('register')}</h2>

          {error && <p className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={otpSent}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phoneHint')}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                maxLength={10}
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('otp')}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none tracking-widest text-center text-lg"
                  maxLength={6}
                />
              </div>
            )}

            <button
              onClick={otpSent ? handleVerify : handleSendOtp}
              disabled={loading || (!otpSent && (phone.length !== 10 || !name)) || (otpSent && otp.length !== 6)}
              className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? tc('loading') : otpSent ? t('verifyOtp') : t('sendOtp')}
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-slate-600">
            <Link href={`/${locale}/login`} className="text-blue-700 hover:underline">
              {t('existingUser')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
