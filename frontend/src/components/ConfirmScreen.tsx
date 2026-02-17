import { Lang, t } from '../i18n';

interface Props {
  lang: Lang;
  onBack: () => void;
}

export default function ConfirmScreen({ lang, onBack }: Props) {
  return (
    <div className="confirm-wrap">
      <div className="confirm-icon">✅</div>
      <h2>{t(lang, 'bookingConfirmed')}</h2>
      <p className="confirm-sub">{t(lang, 'smsSent')}</p>
      <div className="confirm-reminder">{t(lang, 'reminderText')}</div>
      <button className="btn" onClick={onBack}>
        {t(lang, 'backHome')}
      </button>
    </div>
  );
}
