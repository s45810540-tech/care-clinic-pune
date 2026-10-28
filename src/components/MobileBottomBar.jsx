import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { MAPS_LINK, PHONE_TEL, waLink } from '../data/site';
import Icon from './Icon';

/**
 * Sticky bottom action bar on phones (Call · WhatsApp · Book · Directions).
 * Sits above the safe area, hidden from md upwards where the header CTAs take over.
 */
export default function MobileBottomBar() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  const items = [
    { type: 'link', href: `tel:${PHONE_TEL}`, icon: 'phone', label: t('common.call') },
    { type: 'link', href: waLink(), icon: 'whatsapp', label: t('common.whatsappShort'), external: true, green: true },
    { type: 'router', to: '/book', icon: 'calendar', label: t('common.book'), primary: true },
    { type: 'link', href: MAPS_LINK, icon: 'mapPin', label: t('common.directions'), external: true },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-8px_24px_-16px_rgba(12,26,23,0.4)] backdrop-blur-lg md:hidden"
      aria-label={t('common.book')}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active = item.type === 'router' && pathname === item.to;
          const inner = (
            <>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition duration-200 ${
                  item.primary
                    ? 'bg-brand-700 text-white shadow-glow'
                    : item.green
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-brand-50 text-brand-800'
                }`}
              >
                <Icon
                  name={item.icon}
                  className="h-[18px] w-[18px]"
                  fill={item.icon === 'whatsapp' ? 'currentColor' : 'none'}
                  strokeWidth={item.icon === 'whatsapp' ? 0 : 1.8}
                />
              </span>
              <span
                className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${
                  active ? 'text-brand-800' : 'text-ink-soft'
                }`}
              >
                {item.label}
              </span>
            </>
          );

          return (
            <li key={item.label}>
              {item.type === 'router' ? (
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className="flex min-h-[56px] flex-col items-center justify-center py-2"
                >
                  {inner}
                </Link>
              ) : (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex min-h-[56px] flex-col items-center justify-center py-2"
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
