'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getAuthClient } from '@/lib/auth/session';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations('common');
  const router = useRouter();

  async function handleLogout() {
    const auth = getAuthClient();
    await auth.logout();
    router.push(`/${locale}/login`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-blue-800">{t('appName')}</h1>
      <div className="flex items-center gap-3">
        <LanguageSwitcher currentLocale={locale} />
        <button
          onClick={handleLogout}
          className="text-sm text-slate-600 hover:text-red-600 transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    </header>
  );
}
