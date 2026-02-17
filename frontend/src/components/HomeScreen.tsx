import { Lang, t, services } from '../i18n';

interface Props {
  lang: Lang;
  onSelectService: (calLink: string) => void;
}

export default function HomeScreen({ lang, onSelectService }: Props) {
  return (
    <>
      <div className="hero">
        <div className="hero-icon">🩺</div>
        <h1>{t(lang, 'clinicName')}</h1>
        <p className="hero-sub">
          📍Praha, ul. Stamicová 1968/21, Břevnov, PSČ: 16200 &middot; ☎ +420 222 333 444
        </p>
      </div>

      <div className="alert-banner">
        <span className="icon">📢</span>
        <div>
          <div className="title">{t(lang, 'bannerOpen')}</div>
          <div className="sub">{t(lang, 'bannerSub')}</div>
        </div>
      </div>

      <div className="card">
        <h2>{t(lang, 'ourServices')}</h2>
        {services.map((svc) => (
          <div
            key={svc.key}
            className="service-item"
            onClick={() => onSelectService(svc.calLink)}
          >
            <span className="svc-icon">{svc.icon}</span>
            <div style={{ flex: 1 }}>
              <div className="svc-name">{t(lang, svc.key)}</div>
              <div className="svc-desc">{t(lang, svc.key + 'd')}</div>
            </div>
            <div className="svc-dur">⏱ {t(lang, svc.key + 'dur')} →</div>
          </div>
        ))}
      </div>

      <div className="info-chips">
        <div className="info-chip">
          <div className="chip-icon">🛡</div>
          <div className="chip-text">VZP, ČPZP, OZP</div>
        </div>
        <div className="info-chip">
          <div className="chip-icon">🕐</div>
          <div className="chip-text">{t(lang, 'hoursValue')}</div>
        </div>
        <div className="info-chip">
          <div className="chip-icon">🅿️</div>
          <div className="chip-text">{t(lang, 'parking')}</div>
        </div>
      </div>

      <p className="book-hint">{t(lang, 'bookHint')}</p>
    </>
  );
}
