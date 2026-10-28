import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { MAPS_LINK, PHONE_TEL, waLink } from '../data/site';
import Icon from './Icon';

/**
 * Sticky bottom action bar on phones (Call · WhatsApp · Book · Directions).
 * Sits above the safe area and is hidden from md upwards, where the header CTAs cover it.
 */
export default function MobileBottomBar() {
  const { t } = useI18n();

  const items = [
    { type: 'link', href: `tel:${PHONE_TEL}`, icon: 'phone', label: t('common.call') },
    { type: 'link', href: waLink(), icon: 'whatsapp', label: t('common.whatsappShort'), external: true },
    { type: 'router', to: '/book', icon: 'calendar', label: t('common.book'), primary: true },
    { type: 'link', href: MAPS_LINK, icon: 'mapPin', label: t('common.directions'), external: true },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const inner = (
            <>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                  item.primary ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-800'
                }`}
              >
                <Icon
                  name={item.icon}
                  className={`h-5 w-5 ${item.icon === 'whatsapp' ? 'text-emerald-600' : ''} ${
                    item.primary ? 'text-white' : ''
                  }`}
                  fill={item.icon === 'whatsapp' ? 'currentColor' : 'none'}
                  strokeWidth={item.icon === 'whatsapp' ? 0 : 1.7}
                />
              </span>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft">{item.label}</span>
            </>
          );

          return (
            <li key={item.label}>
              {item.type === 'router' ? (
                <Link to={item.to} className="flex flex-col items-center justify-center py-2.5">
                  {inner}
                </Link>
              ) : (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className="flex flex-col items-center justify-center py-2.5"
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
