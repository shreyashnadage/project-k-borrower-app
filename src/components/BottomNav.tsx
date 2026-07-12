'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: '⌂' },
  { key: 'apply', path: '/apply', icon: '＋' },
  { key: 'applications', path: '/applications', icon: '☰' },
  { key: 'profile', path: '/profile', icon: '◉' },
] as const;

export function BottomNav({ locale }: { locale: Locale }) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex justify-around py-2 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const href = `/${locale}${item.path}`;
        const active = pathname.startsWith(href);
        return (
          <Link
            key={item.key}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              active ? 'text-blue-700 font-semibold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
