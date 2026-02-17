import { useEffect, useRef } from 'react';
import { Lang, t, calLocaleMap } from '../i18n';

declare global {
  interface Window {
    Cal?: any;
  }
}

interface Props {
  lang: Lang;
  calLink: string;
  onBack: () => void;
  onBooked: () => void;
}

function loadCalScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Cal?.loaded) {
      resolve();
      return;
    }
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ['initNamespace', namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');
    window.Cal!('init', { origin: 'https://cal.com' });
    resolve();
  });
}

export default function BookingScreen({ lang, calLink, onBack, onBooked }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await loadCalScript();
      if (cancelled || !containerRef.current) return;

      containerRef.current.innerHTML = '';

      window.Cal!('inline', {
        elementOrSelector: containerRef.current,
        calLink,
        layout: 'month_view',
        config: {
          theme: 'light',
          locale: calLocaleMap[lang] || 'cs',
        },
      });

      window.Cal!('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#14b8a6' },
        },
      });

      window.Cal!('on', {
        action: 'bookingSuccessful',
        callback: () => onBooked(),
      });
    }

    init();
    return () => { cancelled = true; };
  }, [calLink, lang, onBooked]);

  return (
    <>
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>←</button>
        <h2>{t(lang, 'selectDateTime')}</h2>
      </div>
      <div className="calcom-container">
        <div ref={containerRef} className="calcom-inline" />
      </div>
    </>
  );
}
