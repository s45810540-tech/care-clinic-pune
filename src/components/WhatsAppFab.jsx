import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { waLink } from '../data/site';
import Icon from './Icon';

/**
 * Floating WhatsApp button — click-to-chat (wa.me), no paid WhatsApp Business API.
 * Desktop/tablet only: on phones the sticky bottom bar already carries WhatsApp,
 * so a second floating button would just sit on top of it.
 */
export default function WhatsAppFab() {
  const [hover, setHover] = useState(false);
  const { t } = useI18n();

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-emerald-700 py-3.5 pl-4 pr-4 text-white
                 shadow-[0_16px_36px_-14px_rgba(16,185,129,0.85)] transition duration-300 ease-brand
                 hover:bg-emerald-800 hover:shadow-[0_20px_44px_-14px_rgba(16,185,129,0.95)] md:flex"
      aria-label="Chat with the clinic on WhatsApp"
      data-magnetic
    >
      <Icon name="whatsapp" className="h-6 w-6" fill="currentColor" strokeWidth={0} />
      <span
        className={`overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 ease-brand ${
          hover ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'
        }`}
        aria-hidden={!hover}
      >
        {t('common.whatsapp')}
      </span>
    </a>
  );
}
