import { useState } from 'react';
import { waLink } from '../data/site';
import Icon from './Icon';

/**
 * Floating WhatsApp button — click-to-chat (wa.me), no paid WhatsApp Business API.
 * Hidden automatically while the mobile bottom bar is showing its own WhatsApp action.
 */
export default function WhatsAppFab() {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full bg-emerald-700 py-3.5 pl-4 pr-4 text-white shadow-[0_12px_32px_-8px_rgba(16,185,129,0.7)] transition hover:bg-emerald-800 md:right-6 md:bottom-6"
      aria-label="Chat with the clinic on WhatsApp"
      data-magnetic
    >
      <Icon name="whatsapp" className="h-6 w-6" fill="currentColor" strokeWidth={0} />
      <span
        className={`hidden overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 md:inline-block ${
          hover ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Chat with us
      </span>
    </a>
  );
}
